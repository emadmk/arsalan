import { pool } from '../config/database';
import bcrypt from 'bcryptjs';
import { User, UserPublic } from '../types';

export class UserModel {
  /**
   * Create a new user
   */
  static async create(
    email: string,
    password: string,
    fullName?: string,
    phone?: string,
    role: 'admin' | 'customer' = 'customer'
  ): Promise<UserPublic> {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, phone, role, is_active, email_verified, created_at, updated_at`,
      [email, passwordHash, fullName, phone, role]
    );

    return result.rows[0];
  }

  /**
   * Find user by email (including password hash)
   */
  static async findByEmailWithPassword(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0] || null;
  }

  /**
   * Find user by email (without password hash)
   */
  static async findByEmail(email: string): Promise<UserPublic | null> {
    const result = await pool.query(
      `SELECT id, email, full_name, phone, role, is_active, email_verified, created_at, updated_at
       FROM users WHERE email = $1`,
      [email]
    );

    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<UserPublic | null> {
    const result = await pool.query(
      `SELECT id, email, full_name, phone, role, is_active, email_verified, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Update user
   */
  static async update(
    id: string,
    updates: Partial<Pick<User, 'full_name' | 'phone' | 'email_verified' | 'is_active'>>
  ): Promise<UserPublic> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.full_name !== undefined) {
      fields.push(`full_name = $${paramCount++}`);
      values.push(updates.full_name);
    }
    if (updates.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(updates.phone);
    }
    if (updates.email_verified !== undefined) {
      fields.push(`email_verified = $${paramCount++}`);
      values.push(updates.email_verified);
    }
    if (updates.is_active !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(updates.is_active);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE users
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, email, full_name, phone, role, is_active, email_verified, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }

  /**
   * Update password
   */
  static async updatePassword(id: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, id]
    );
  }

  /**
   * Verify password
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Get all users (admin only)
   */
  static async findAll(limit = 100, offset = 0): Promise<UserPublic[]> {
    const result = await pool.query(
      `SELECT id, email, full_name, phone, role, is_active, email_verified, created_at, updated_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  }

  /**
   * Count total users
   */
  static async count(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    return parseInt(result.rows[0].count);
  }

  /**
   * Delete user (soft delete by setting is_active = false)
   */
  static async softDelete(id: string): Promise<void> {
    await pool.query(
      'UPDATE users SET is_active = false WHERE id = $1',
      [id]
    );
  }

  /**
   * Hard delete user (permanent)
   */
  static async hardDelete(id: string): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
