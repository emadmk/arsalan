import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate, validate } from '../middleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validate({
    email: { required: true, type: 'email' },
    password: { required: true, type: 'password' },
    full_name: { required: false, type: 'string', maxLength: 255 },
    phone: { required: false, type: 'string', maxLength: 50 },
  }),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validate({
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string' },
  }),
  authController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  validate({
    refreshToken: { required: true, type: 'string' },
  }),
  authController.refreshAccessToken
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route   PATCH /api/auth/me
 * @desc    Update user profile
 * @access  Private
 */
router.patch(
  '/me',
  authenticate,
  validate({
    full_name: { required: false, type: 'string', maxLength: 255 },
    phone: { required: false, type: 'string', maxLength: 50 },
  }),
  authController.updateProfile
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  validate({
    currentPassword: { required: true, type: 'string' },
    newPassword: { required: true, type: 'password' },
  }),
  authController.changePassword
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', authController.logout);

export default router;
