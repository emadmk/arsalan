import { Request, Response } from 'express';
import { OrderModel, ProductModel, TransactionModel, CertificateModel } from '../models';
import { nowPaymentsService, emailService, pdfService } from '../services';
import { asyncHandler } from '../middleware';
import {
  CreateOrderRequest,
  CreatePaymentRequest,
  ValidationError,
  NotFoundError,
  AuthenticationError,
} from '../types';

/**
 * Create a new order
 * POST /api/orders
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const orderData: CreateOrderRequest = req.body;

  // Validate product exists and is available
  const product = await ProductModel.findById(orderData.product_id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  if (product.status !== 'active') {
    throw new ValidationError('Product is not available for purchase');
  }

  // Check grid availability
  const isAvailable = await ProductModel.isGridAvailable(orderData.product_id);
  if (!isAvailable) {
    throw new ValidationError('No grid positions available');
  }

  // Create order
  const order = await OrderModel.create(
    req.user.id,
    orderData.customer_name,
    orderData.customer_email,
    product.price_usd,
    {
      customerPhone: orderData.customer_phone,
      shippingCountry: orderData.shipping_country,
      shippingCity: orderData.shipping_city,
      shippingAddress: orderData.shipping_address,
      shippingPostalCode: orderData.shipping_postal_code,
      productId: orderData.product_id,
      gridPosition: orderData.grid_position,
      customerNotes: orderData.customer_notes,
    }
  );

  // Reserve grid position
  await ProductModel.reserveGrid(orderData.product_id, 1);
  await ProductModel.updateStatusByAvailability(orderData.product_id);

  // Send order confirmation email
  try {
    await emailService.sendOrderConfirmation(order.customer_email, {
      customerName: order.customer_name,
      orderNumber: order.order_number,
      productName: product.name,
      totalAmount: order.total_amount_usd,
      orderDate: new Date(order.created_at).toLocaleDateString(),
    });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }

  // Get order with relations
  const orderWithRelations = await OrderModel.findByIdWithRelations(order.id);

  res.status(201).json({ order: orderWithRelations });
});

/**
 * Create payment for an order
 * POST /api/orders/:orderId/payment
 */
export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const { orderId } = req.params;
  const { pay_currency }: CreatePaymentRequest = req.body;

  // Get order
  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Verify order belongs to user or user is admin
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    throw new AuthenticationError('Access denied');
  }

  // Check if order already has a completed payment
  const existingTransactions = await TransactionModel.findByOrderId(orderId);
  const completedTransaction = existingTransactions.find(
    t => t.payment_status === 'finished' || t.payment_status === 'confirmed'
  );

  if (completedTransaction) {
    throw new ValidationError('Order already has a completed payment');
  }

  // Create payment with NOWPayments
  const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/webhooks/nowpayments`;

  const paymentResponse = await nowPaymentsService.createPayment({
    price_amount: order.total_amount_usd,
    price_currency: 'USD',
    pay_currency,
    ipn_callback_url: callbackUrl,
    order_id: order.order_number,
    order_description: `Order ${order.order_number} - Persian Kerman Carpet`,
  });

  // Create transaction record
  const transaction = await TransactionModel.create(
    orderId,
    req.user.id,
    pay_currency,
    order.total_amount_usd,
    'USD',
    {
      paymentId: paymentResponse.payment_id,
      paymentStatus: paymentResponse.payment_status,
      payAmount: paymentResponse.pay_amount,
      payAddress: paymentResponse.pay_address,
      expiresAt: new Date(paymentResponse.expiration_estimate_date),
    }
  );

  // Update order status
  await OrderModel.updateStatus(orderId, 'payment_pending', 'pending');

  res.json({
    transaction,
    payment: {
      payment_id: paymentResponse.payment_id,
      pay_address: paymentResponse.pay_address,
      pay_amount: paymentResponse.pay_amount,
      pay_currency: paymentResponse.pay_currency,
      expiration_date: paymentResponse.expiration_estimate_date,
    },
  });
});

/**
 * Get order by ID
 * GET /api/orders/:orderId
 */
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const { orderId } = req.params;

  const order = await OrderModel.findByIdWithRelations(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Verify order belongs to user or user is admin
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    throw new AuthenticationError('Access denied');
  }

  res.json({ order });
});

/**
 * Get order by order number
 * GET /api/orders/number/:orderNumber
 */
export const getOrderByNumber = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const { orderNumber } = req.params;

  const order = await OrderModel.findByOrderNumber(orderNumber);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Verify order belongs to user or user is admin
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    throw new AuthenticationError('Access denied');
  }

  const orderWithRelations = await OrderModel.findByIdWithRelations(order.id);

  res.json({ order: orderWithRelations });
});

/**
 * Get user's orders
 * GET /api/orders/my
 */
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  const orders = await OrderModel.findByUserId(req.user.id, limit, offset);

  res.json({ orders });
});

/**
 * Get payment status for an order
 * GET /api/orders/:orderId/payment-status
 */
export const getPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const { orderId } = req.params;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Verify order belongs to user or user is admin
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    throw new AuthenticationError('Access denied');
  }

  const transactions = await TransactionModel.findByOrderId(orderId);

  res.json({
    order_status: order.order_status,
    payment_status: order.payment_status,
    transactions,
  });
});

/**
 * Download certificate for an order
 * GET /api/orders/:orderId/certificate
 */
export const downloadCertificate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const { orderId } = req.params;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Verify order belongs to user or user is admin
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    throw new AuthenticationError('Access denied');
  }

  // Check if certificate exists
  const certificate = await CertificateModel.findByOrderId(orderId);
  if (!certificate) {
    throw new NotFoundError('Certificate not found');
  }

  if (!certificate.is_issued) {
    throw new ValidationError('Certificate has not been issued yet');
  }

  // Get certificate file path
  const certificatePath = pdfService.getCertificatePath(certificate.certificate_number);

  if (!pdfService.certificateExists(certificate.certificate_number)) {
    throw new NotFoundError('Certificate file not found');
  }

  // Send file
  res.download(certificatePath, `certificate-${certificate.certificate_number}.pdf`);
});

/**
 * Get all orders (admin only)
 * GET /api/admin/orders
 */
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;
  const orderStatus = req.query.orderStatus as any;
  const paymentStatus = req.query.paymentStatus as any;
  const searchQuery = req.query.search as string;

  const orders = await OrderModel.findAll({
    limit,
    offset,
    orderStatus,
    paymentStatus,
    searchQuery,
  });

  const totalOrders = await OrderModel.countByStatus(orderStatus, paymentStatus);

  res.json({
    orders,
    pagination: {
      total: totalOrders,
      limit,
      offset,
      hasMore: offset + orders.length < totalOrders,
    },
  });
});

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard
 */
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await OrderModel.getDashboardStats();

  // Get recent transactions
  const recentTransactions = await TransactionModel.getRecent(10);

  res.json({
    ...stats,
    recent_transactions: recentTransactions,
  });
});
