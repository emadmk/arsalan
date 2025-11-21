import { pool } from '../config/database';
import { Transaction } from '../types';

export class TransactionModel {
  /**
   * Create a new transaction
   */
  static async create(
    orderId: string,
    userId: string,
    payCurrency: string,
    priceAmount: number,
    priceCurrency: string = 'USD',
    transactionData: {
      paymentId?: string;
      invoiceId?: string;
      paymentStatus?: string;
      payAmount?: number;
      payAddress?: string;
      paymentUrl?: string;
      invoiceUrl?: string;
      expiresAt?: Date;
    } = {}
  ): Promise<Transaction> {
    const result = await pool.query(
      `INSERT INTO transactions (
        order_id, user_id, pay_currency, price_amount, price_currency,
        payment_id, invoice_id, payment_status, pay_amount, pay_address,
        payment_url, invoice_url, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        orderId,
        userId,
        payCurrency,
        priceAmount,
        priceCurrency,
        transactionData.paymentId,
        transactionData.invoiceId,
        transactionData.paymentStatus || 'waiting',
        transactionData.payAmount,
        transactionData.payAddress,
        transactionData.paymentUrl,
        transactionData.invoiceUrl,
        transactionData.expiresAt,
      ]
    );

    return result.rows[0];
  }

  /**
   * Find transaction by ID
   */
  static async findById(id: string): Promise<Transaction | null> {
    const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Find transaction by payment ID (NOWPayments payment_id)
   */
  static async findByPaymentId(paymentId: string): Promise<Transaction | null> {
    const result = await pool.query('SELECT * FROM transactions WHERE payment_id = $1', [paymentId]);
    return result.rows[0] || null;
  }

  /**
   * Find transactions by order ID
   */
  static async findByOrderId(orderId: string): Promise<Transaction[]> {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE order_id = $1 ORDER BY created_at DESC',
      [orderId]
    );
    return result.rows;
  }

  /**
   * Find transactions by user ID
   */
  static async findByUserId(userId: string, limit = 50, offset = 0): Promise<Transaction[]> {
    const result = await pool.query(
      `SELECT * FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  /**
   * Find all transactions with filters
   */
  static async findAll(options: {
    limit?: number;
    offset?: number;
    paymentStatus?: string;
    payCurrency?: string;
    userId?: string;
  } = {}): Promise<Transaction[]> {
    const { limit = 50, offset = 0, paymentStatus, payCurrency, userId } = options;

    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (paymentStatus) {
      query += ` AND payment_status = $${paramCount++}`;
      params.push(paymentStatus);
    }

    if (payCurrency) {
      query += ` AND pay_currency = $${paramCount++}`;
      params.push(payCurrency);
    }

    if (userId) {
      query += ` AND user_id = $${paramCount++}`;
      params.push(userId);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Update transaction with NOWPayments webhook data
   */
  static async updateFromWebhook(
    paymentId: string,
    updates: {
      paymentStatus: string;
      actuallyPaid?: number;
      payinHash?: string;
      outcomeAmount?: number;
      outcomeCurrency?: string;
    }
  ): Promise<Transaction> {
    const fields: string[] = ['payment_status = $1'];
    const values: any[] = [updates.paymentStatus];
    let paramCount = 2;

    if (updates.actuallyPaid !== undefined) {
      fields.push(`actually_paid = $${paramCount++}`);
      values.push(updates.actuallyPaid);
    }

    if (updates.payinHash !== undefined) {
      fields.push(`payin_hash = $${paramCount++}`);
      values.push(updates.payinHash);
    }

    if (updates.outcomeAmount !== undefined) {
      fields.push(`outcome_amount = $${paramCount++}`);
      values.push(updates.outcomeAmount);
    }

    if (updates.outcomeCurrency !== undefined) {
      fields.push(`outcome_currency = $${paramCount++}`);
      values.push(updates.outcomeCurrency);
    }

    // Set confirmed_at timestamp if payment is confirmed/finished
    if (['confirmed', 'finished', 'partially_paid'].includes(updates.paymentStatus)) {
      fields.push(`confirmed_at = COALESCE(confirmed_at, CURRENT_TIMESTAMP)`);
    }

    values.push(paymentId);

    const result = await pool.query(
      `UPDATE transactions
       SET ${fields.join(', ')}
       WHERE payment_id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Update transaction status
   */
  static async updateStatus(id: string, paymentStatus: string): Promise<Transaction> {
    const result = await pool.query(
      `UPDATE transactions
       SET payment_status = $1,
           confirmed_at = CASE
             WHEN $1 IN ('confirmed', 'finished') AND confirmed_at IS NULL
             THEN CURRENT_TIMESTAMP
             ELSE confirmed_at
           END
       WHERE id = $2
       RETURNING *`,
      [paymentStatus, id]
    );

    return result.rows[0];
  }

  /**
   * Get recent transactions
   */
  static async getRecent(limit = 10): Promise<Transaction[]> {
    const result = await pool.query(
      'SELECT * FROM transactions ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  /**
   * Get transaction statistics
   */
  static async getStats() {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_transactions,
        COUNT(CASE WHEN payment_status IN ('confirmed', 'finished') THEN 1 END) as completed_transactions,
        COUNT(CASE WHEN payment_status = 'waiting' THEN 1 END) as pending_transactions,
        COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_transactions,
        COALESCE(SUM(CASE WHEN payment_status IN ('confirmed', 'finished') THEN price_amount ELSE 0 END), 0) as total_revenue_usd,
        COUNT(DISTINCT user_id) as unique_customers
      FROM transactions
    `);

    return {
      total_transactions: parseInt(result.rows[0].total_transactions),
      completed_transactions: parseInt(result.rows[0].completed_transactions),
      pending_transactions: parseInt(result.rows[0].pending_transactions),
      failed_transactions: parseInt(result.rows[0].failed_transactions),
      total_revenue_usd: parseFloat(result.rows[0].total_revenue_usd),
      unique_customers: parseInt(result.rows[0].unique_customers),
    };
  }

  /**
   * Get transactions by currency
   */
  static async getTransactionsByCurrency(): Promise<{ pay_currency: string; count: number; total_usd: number }[]> {
    const result = await pool.query(`
      SELECT
        pay_currency,
        COUNT(*) as count,
        COALESCE(SUM(price_amount), 0) as total_usd
      FROM transactions
      WHERE payment_status IN ('confirmed', 'finished')
      GROUP BY pay_currency
      ORDER BY total_usd DESC
    `);

    return result.rows.map((row: any) => ({
      pay_currency: row.pay_currency,
      count: parseInt(row.count),
      total_usd: parseFloat(row.total_usd),
    }));
  }

  /**
   * Count transactions
   */
  static async count(paymentStatus?: string): Promise<number> {
    let query = 'SELECT COUNT(*) FROM transactions WHERE 1=1';
    const params: any[] = [];

    if (paymentStatus) {
      query += ' AND payment_status = $1';
      params.push(paymentStatus);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  }

  /**
   * Delete transaction (should rarely be used)
   */
  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
  }
}
