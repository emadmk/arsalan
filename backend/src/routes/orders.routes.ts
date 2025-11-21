import { Router } from 'express';
import * as ordersController from '../controllers/orders.controller';
import { authenticate, requireAdmin, validate } from '../middleware';

const router = Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validate({
    customer_name: { required: true, type: 'string', maxLength: 255 },
    customer_email: { required: true, type: 'email' },
    customer_phone: { required: false, type: 'string', maxLength: 50 },
    shipping_country: { required: false, type: 'string', maxLength: 100 },
    shipping_city: { required: false, type: 'string', maxLength: 100 },
    shipping_address: { required: false, type: 'string' },
    shipping_postal_code: { required: false, type: 'string', maxLength: 20 },
    product_id: { required: true, type: 'uuid' },
    grid_position: { required: false, type: 'number', min: 1 },
    customer_notes: { required: false, type: 'string' },
  }),
  ordersController.createOrder
);

/**
 * @route   POST /api/orders/:orderId/payment
 * @desc    Create payment for an order
 * @access  Private
 */
router.post(
  '/:orderId/payment',
  authenticate,
  validate({
    orderId: { required: true, type: 'uuid' },
    pay_currency: { required: true, type: 'string' },
  }),
  ordersController.createPayment
);

/**
 * @route   GET /api/orders/my
 * @desc    Get current user's orders
 * @access  Private
 */
router.get('/my', authenticate, ordersController.getMyOrders);

/**
 * @route   GET /api/orders/number/:orderNumber
 * @desc    Get order by order number
 * @access  Private
 */
router.get('/number/:orderNumber', authenticate, ordersController.getOrderByNumber);

/**
 * @route   GET /api/orders/:orderId
 * @desc    Get order by ID
 * @access  Private
 */
router.get(
  '/:orderId',
  authenticate,
  validate({
    orderId: { required: true, type: 'uuid' },
  }),
  ordersController.getOrder
);

/**
 * @route   GET /api/orders/:orderId/payment-status
 * @desc    Get payment status for an order
 * @access  Private
 */
router.get(
  '/:orderId/payment-status',
  authenticate,
  validate({
    orderId: { required: true, type: 'uuid' },
  }),
  ordersController.getPaymentStatus
);

/**
 * @route   GET /api/orders/:orderId/certificate
 * @desc    Download certificate for an order
 * @access  Private
 */
router.get(
  '/:orderId/certificate',
  authenticate,
  validate({
    orderId: { required: true, type: 'uuid' },
  }),
  ordersController.downloadCertificate
);

export default router;
