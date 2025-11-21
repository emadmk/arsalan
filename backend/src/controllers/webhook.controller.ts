import { Request, Response } from 'express';
import { OrderModel, TransactionModel } from '../models';
import { nowPaymentsService, emailService } from '../services';
import { asyncHandler } from '../middleware';
import { NOWPaymentsIPNPayload } from '../types';

/**
 * Handle NOWPayments IPN (Instant Payment Notification)
 * POST /api/webhooks/nowpayments
 */
export const handleNOWPaymentsWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['x-nowpayments-sig'] as string;
  const payload = JSON.stringify(req.body);

  // Verify signature
  const isValid = nowPaymentsService.verifyIPNSignature(payload, signature);
  if (!isValid) {
    console.error('[Webhook] Invalid NOWPayments signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const ipnData: NOWPaymentsIPNPayload = req.body;

  console.log('[Webhook] Received NOWPayments IPN:', {
    payment_id: ipnData.payment_id,
    payment_status: ipnData.payment_status,
    order_id: ipnData.order_id,
  });

  try {
    // Find transaction by payment_id
    const transaction = await TransactionModel.findByPaymentId(ipnData.payment_id);

    if (!transaction) {
      console.error('[Webhook] Transaction not found:', ipnData.payment_id);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update transaction with IPN data
    await TransactionModel.updateFromWebhook(ipnData.payment_id, {
      paymentStatus: ipnData.payment_status,
      actuallyPaid: ipnData.actually_paid,
      payinHash: ipnData.payin_hash,
      outcomeAmount: ipnData.outcome_amount,
      outcomeCurrency: ipnData.outcome_currency,
    });

    // Get order
    const order = await OrderModel.findById(transaction.order_id);
    if (!order) {
      console.error('[Webhook] Order not found:', transaction.order_id);
      return res.status(404).json({ error: 'Order not found' });
    }

    // Handle different payment statuses
    switch (ipnData.payment_status) {
      case 'waiting':
        console.log('[Webhook] Payment waiting:', ipnData.payment_id);
        // No action needed
        break;

      case 'confirming':
        console.log('[Webhook] Payment confirming:', ipnData.payment_id);
        await OrderModel.updateStatus(transaction.order_id, undefined, 'processing');
        break;

      case 'confirmed':
      case 'finished':
        console.log('[Webhook] Payment confirmed/finished:', ipnData.payment_id);

        // Update order status
        await OrderModel.updateStatus(
          transaction.order_id,
          'payment_received',
          'completed'
        );

        // Send payment confirmation email
        try {
          await emailService.sendPaymentReceived(order.customer_email, {
            customerName: order.customer_name,
            orderNumber: order.order_number,
            cryptoCurrency: ipnData.pay_currency,
            cryptoAmount: ipnData.actually_paid,
            usdAmount: order.total_amount_usd,
            transactionHash: ipnData.payin_hash,
          });
        } catch (error) {
          console.error('[Webhook] Failed to send payment confirmation email:', error);
        }
        break;

      case 'partially_paid':
        console.log('[Webhook] Payment partially paid:', ipnData.payment_id);
        await OrderModel.updateStatus(transaction.order_id, undefined, 'partially_refunded');
        break;

      case 'sending':
        console.log('[Webhook] Payment sending:', ipnData.payment_id);
        await OrderModel.updateStatus(transaction.order_id, undefined, 'processing');
        break;

      case 'failed':
        console.log('[Webhook] Payment failed:', ipnData.payment_id);
        await OrderModel.updateStatus(transaction.order_id, 'cancelled', 'failed');
        break;

      case 'refunded':
      case 'expired':
        console.log('[Webhook] Payment refunded/expired:', ipnData.payment_id);
        await OrderModel.updateStatus(transaction.order_id, 'cancelled', 'refunded');
        break;

      default:
        console.log('[Webhook] Unknown payment status:', ipnData.payment_status);
    }

    console.log('[Webhook] Successfully processed IPN for:', ipnData.payment_id);
    res.json({ status: 'success' });
  } catch (error) {
    console.error('[Webhook] Error processing NOWPayments IPN:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
