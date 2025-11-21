import { Request, Response } from 'express';
import { UserModel } from '../models';
import { generateToken, generateRefreshToken, verifyToken, asyncHandler } from '../middleware';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ValidationError,
  AuthenticationError,
} from '../types';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, full_name, phone }: RegisterRequest = req.body;

  // Check if user already exists
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new ValidationError('Email already registered');
  }

  // Create user
  const user = await UserModel.create(email, password, full_name, phone, 'customer');

  // Generate tokens
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response: AuthResponse = {
    user,
    token,
    refreshToken,
  };

  res.status(201).json(response);
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  // Find user with password
  const user = await UserModel.findByEmailWithPassword(email);
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Check if account is active
  if (!user.is_active) {
    throw new AuthenticationError('Account is deactivated');
  }

  // Verify password
  const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Remove password from response
  const { password_hash, ...userPublic } = user;

  // Generate tokens
  const token = generateToken({
    userId: userPublic.id,
    email: userPublic.email,
    role: userPublic.role,
  });

  const refreshToken = generateRefreshToken({
    userId: userPublic.id,
    email: userPublic.email,
    role: userPublic.role,
  });

  const response: AuthResponse = {
    user: userPublic,
    token,
    refreshToken,
  };

  res.json(response);
});

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('Refresh token is required');
  }

  // Verify refresh token
  const payload = verifyToken(refreshToken);

  // Get user
  const user = await UserModel.findById(payload.userId);
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  if (!user.is_active) {
    throw new AuthenticationError('Account is deactivated');
  }

  // Generate new access token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.json({ token });
});

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Not authenticated');
  }

  res.json({ user: req.user });
});

/**
 * Update current user profile
 * PATCH /api/auth/me
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Not authenticated');
  }

  const { full_name, phone } = req.body;

  const updates: any = {};
  if (full_name !== undefined) updates.full_name = full_name;
  if (phone !== undefined) updates.phone = phone;

  const updatedUser = await UserModel.update(req.user.id, updates);

  res.json({ user: updatedUser });
});

/**
 * Change password
 * POST /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Not authenticated');
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError('Current password and new password are required');
  }

  // Get user with password
  const user = await UserModel.findByEmailWithPassword(req.user.email);
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  // Verify current password
  const isValidPassword = await UserModel.verifyPassword(currentPassword, user.password_hash);
  if (!isValidPassword) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Update password
  await UserModel.updatePassword(user.id, newPassword);

  res.json({ message: 'Password updated successfully' });
});

/**
 * Logout (client-side only, invalidate token on client)
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // In a JWT system, logout is typically handled client-side by removing the token
  // For additional security, you could implement token blacklisting here
  res.json({ message: 'Logged out successfully' });
});
