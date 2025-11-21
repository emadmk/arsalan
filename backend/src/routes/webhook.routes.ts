import { Router } from 'express';
import * as webhookController from '../controllers/webhook.controller';

const router = Router();

/**
 * @route   POST /api/webhooks/nowpayments
 * @desc    Handle NOWPayments IPN (Instant Payment Notification)
 * @access  Public (verified by signature)
 */
router.post('/nowpayments', webhookController.handleNOWPaymentsWebhook);

export default router;
