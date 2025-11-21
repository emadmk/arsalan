import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, requireAdmin, validate, validatePagination } from '../middleware';

const router = Router();

// Apply authentication and admin check to all routes
router.use(authenticate, requireAdmin);

// === Orders Management ===

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders with filters
 * @access  Admin
 */
router.get('/orders', validatePagination, adminController.getAllOrders);

/**
 * @route   PATCH /api/admin/orders/:orderId/status
 * @desc    Update order status
 * @access  Admin
 */
router.patch(
  '/orders/:orderId/status',
  validate({
    orderId: { required: true, type: 'uuid' },
    order_status: {
      required: false,
      enum: [
        'pending',
        'payment_pending',
        'payment_received',
        'in_production',
        'quality_check',
        'ready_to_ship',
        'shipped',
        'delivered',
        'completed',
        'cancelled',
        'refunded',
      ],
    },
    payment_status: {
      required: false,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
    },
    admin_notes: { required: false, type: 'string' },
    tracking_number: { required: false, type: 'string', maxLength: 100 },
  }),
  adminController.updateOrderStatus
);

/**
 * @route   POST /api/admin/orders/:orderId/issue-certificate
 * @desc    Manually issue certificate for an order
 * @access  Admin
 */
router.post(
  '/orders/:orderId/issue-certificate',
  validate({
    orderId: { required: true, type: 'uuid' },
  }),
  adminController.issueCertificate
);

// === Dashboard ===

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Admin
 */
router.get('/dashboard', adminController.getDashboardStats);

// === Products Management ===

/**
 * @route   GET /api/admin/products
 * @desc    Get all products
 * @access  Admin
 */
router.get('/products', validatePagination, adminController.getAllProducts);

/**
 * @route   POST /api/admin/products
 * @desc    Create a new product
 * @access  Admin
 */
router.post(
  '/products',
  validate({
    name: { required: true, type: 'string', maxLength: 255 },
    description: { required: false, type: 'string' },
    price_usd: { required: true, type: 'number', min: 0 },
    images: { required: false },
    grid_total: { required: false, type: 'number', min: 1 },
    status: { required: false, enum: ['active', 'inactive', 'sold_out'] },
  }),
  adminController.createProduct
);

/**
 * @route   PATCH /api/admin/products/:productId
 * @desc    Update a product
 * @access  Admin
 */
router.patch(
  '/products/:productId',
  validate({
    productId: { required: true, type: 'uuid' },
    name: { required: false, type: 'string', maxLength: 255 },
    description: { required: false, type: 'string' },
    price_usd: { required: false, type: 'number', min: 0 },
    images: { required: false },
    grid_total: { required: false, type: 'number', min: 1 },
    grid_available: { required: false, type: 'number', min: 0 },
    status: { required: false, enum: ['active', 'inactive', 'sold_out'] },
  }),
  adminController.updateProduct
);

/**
 * @route   DELETE /api/admin/products/:productId
 * @desc    Delete a product
 * @access  Admin
 */
router.delete(
  '/products/:productId',
  validate({
    productId: { required: true, type: 'uuid' },
  }),
  adminController.deleteProduct
);

// === Users Management ===

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Admin
 */
router.get('/users', validatePagination, adminController.getAllUsers);

/**
 * @route   PATCH /api/admin/users/:userId
 * @desc    Update a user
 * @access  Admin
 */
router.patch(
  '/users/:userId',
  validate({
    userId: { required: true, type: 'uuid' },
    full_name: { required: false, type: 'string', maxLength: 255 },
    phone: { required: false, type: 'string', maxLength: 50 },
    email_verified: { required: false, type: 'boolean' },
    is_active: { required: false, type: 'boolean' },
  }),
  adminController.updateUser
);

/**
 * @route   POST /api/admin/users/:userId/deactivate
 * @desc    Deactivate a user
 * @access  Admin
 */
router.post(
  '/users/:userId/deactivate',
  validate({
    userId: { required: true, type: 'uuid' },
  }),
  adminController.deactivateUser
);

// === Settings Management ===

/**
 * @route   GET /api/admin/settings
 * @desc    Get all settings
 * @access  Admin
 */
router.get('/settings', adminController.getAllSettings);

/**
 * @route   PATCH /api/admin/settings/:key
 * @desc    Update a setting
 * @access  Admin
 */
router.patch(
  '/settings/:key',
  validate({
    key: { required: true, type: 'string' },
    value: { required: true, type: 'string' },
  }),
  adminController.updateSetting
);

// === Transactions Management ===

/**
 * @route   GET /api/admin/transactions
 * @desc    Get all transactions
 * @access  Admin
 */
router.get('/transactions', validatePagination, adminController.getAllTransactions);

/**
 * @route   GET /api/admin/transactions/stats
 * @desc    Get transaction statistics
 * @access  Admin
 */
router.get('/transactions/stats', adminController.getTransactionStats);

export default router;
