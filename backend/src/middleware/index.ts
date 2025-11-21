// Export all middleware
export {
  authenticate,
  optionalAuthenticate,
  authorize,
  requireAdmin,
  requireOwnerOrAdmin,
  requireEmailVerified,
  generateToken,
  generateRefreshToken,
  verifyToken,
  type JWTPayload,
} from './auth';

export {
  errorHandler,
  notFoundHandler,
  asyncHandler,
} from './errorHandler';

export {
  validate,
  sanitizeBody,
  validatePagination,
  isValidEmail,
  isValidPassword,
  isValidUUID,
  sanitizeInput,
} from './validation';
