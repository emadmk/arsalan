import { Request, Response } from 'express';
import {
  OrderModel,
  ProductModel,
  UserModel,
  TransactionModel,
  CertificateModel,
  SettingsModel,
} from '../models';
import { emailService, pdfService } from '../services';
import { asyncHandler } from '../middleware';
import {
  ValidationError,
  NotFoundError,
  UpdateOrderStatusRequest,
  OrderStatus,
  PaymentStatus,
} from '../types';

/**
 * Update order status
 * PATCH /api/admin/orders/:orderId/status
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const {
    order_status,
    payment_status,
    admin_notes,
    tracking_number,
  }: UpdateOrderStatusRequest = req.body;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Update order status
  const updatedOrder = await OrderModel.updateStatus(
    orderId,
    order_status,
    payment_status,
    admin_notes,
    tracking_number
  );

  // Send status update email
  try {
    await emailService.sendOrderStatusUpdate(
      order.customer_email,
      order.customer_name,
      order.order_number,
      order_status || order.order_status,
      admin_notes || 'Your order status has been updated'
    );
  } catch (error) {
    console.error('Failed to send status update email:', error);
  }

  // If order is completed, generate and send certificate
  if (order_status === 'completed' && payment_status === 'completed') {
    try {
      await generateAndSendCertificate(orderId);
    } catch (error) {
      console.error('Failed to generate/send certificate:', error);
    }
  }

  res.json({ order: updatedOrder });
});

/**
 * Generate and send certificate for an order
 */
async function generateAndSendCertificate(orderId: string) {
  // Check if certificate already exists
  let certificate = await CertificateModel.findByOrderId(orderId);

  if (!certificate) {
    // Create certificate record
    certificate = await CertificateModel.create(orderId);
  }

  if (certificate.is_issued) {
    console.log('Certificate already issued');
    return;
  }

  // Get order with product details
  const orderWithRelations = await OrderModel.findByIdWithRelations(orderId);
  if (!orderWithRelations || !orderWithRelations.product) {
    throw new Error('Order or product not found');
  }

  // Generate PDF certificate
  const certificatePath = await pdfService.generateCertificate(
    orderWithRelations,
    certificate,
    orderWithRelations.product.name
  );

  // Update certificate with PDF URL
  const certificateUrl = pdfService.getCertificateUrl(certificate.certificate_number);
  await CertificateModel.update(certificate.id, {
    pdf_url: certificateUrl,
    is_issued: true,
  });

  // Send certificate email
  await emailService.sendCertificate(orderWithRelations.customer_email, {
    customerName: orderWithRelations.customer_name,
    orderNumber: orderWithRelations.order_number,
    certificateNumber: certificate.certificate_number,
    certificatePdfUrl: certificateUrl,
  });
}

/**
 * Get all orders with filters
 * GET /api/admin/orders
 */
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;
  const orderStatus = req.query.orderStatus as OrderStatus;
  const paymentStatus = req.query.paymentStatus as PaymentStatus;
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
  const orderStats = await OrderModel.getDashboardStats();
  const transactionStats = await TransactionModel.getStats();
  const recentTransactions = await TransactionModel.getRecent(10);

  res.json({
    ...orderStats,
    transaction_stats: transactionStats,
    recent_transactions: recentTransactions,
  });
});

/**
 * Get all products
 * GET /api/admin/products
 */
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  const products = await ProductModel.findAll({ limit, offset });
  const total = await ProductModel.count();

  res.json({
    products,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + products.length < total,
    },
  });
});

/**
 * Create product
 * POST /api/admin/products
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price_usd, images, grid_total, status } = req.body;

  const product = await ProductModel.create(
    name,
    price_usd,
    description,
    images,
    grid_total,
    status
  );

  res.status(201).json({ product });
});

/**
 * Update product
 * PATCH /api/admin/products/:productId
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const updates = req.body;

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  const updatedProduct = await ProductModel.update(productId, updates);

  res.json({ product: updatedProduct });
});

/**
 * Delete product
 * DELETE /api/admin/products/:productId
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  await ProductModel.delete(productId);

  res.json({ message: 'Product deleted successfully' });
});

/**
 * Get all users
 * GET /api/admin/users
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  const users = await UserModel.findAll(limit, offset);
  const total = await UserModel.count();

  res.json({
    users,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + users.length < total,
    },
  });
});

/**
 * Update user
 * PATCH /api/admin/users/:userId
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const updates = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const updatedUser = await UserModel.update(userId, updates);

  res.json({ user: updatedUser });
});

/**
 * Deactivate user
 * POST /api/admin/users/:userId/deactivate
 */
export const deactivateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  await UserModel.softDelete(userId);

  res.json({ message: 'User deactivated successfully' });
});

/**
 * Get all settings
 * GET /api/admin/settings
 */
export const getAllSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await SettingsModel.getAll();

  res.json({ settings });
});

/**
 * Update setting
 * PATCH /api/admin/settings/:key
 */
export const updateSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  const { value } = req.body;

  if (!value) {
    throw new ValidationError('Value is required');
  }

  const setting = await SettingsModel.set(key, value);

  res.json({ setting });
});

/**
 * Get all transactions
 * GET /api/admin/transactions
 */
export const getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;
  const paymentStatus = req.query.paymentStatus as string;
  const payCurrency = req.query.payCurrency as string;

  const transactions = await TransactionModel.findAll({
    limit,
    offset,
    paymentStatus,
    payCurrency,
  });

  const total = await TransactionModel.count(paymentStatus);

  res.json({
    transactions,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + transactions.length < total,
    },
  });
});

/**
 * Get transaction statistics
 * GET /api/admin/transactions/stats
 */
export const getTransactionStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await TransactionModel.getStats();
  const currencyStats = await TransactionModel.getTransactionsByCurrency();

  res.json({
    ...stats,
    by_currency: currencyStats,
  });
});

/**
 * Manually issue certificate for an order
 * POST /api/admin/orders/:orderId/issue-certificate
 */
export const issueCertificate = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  await generateAndSendCertificate(orderId);

  res.json({ message: 'Certificate issued and sent successfully' });
});
