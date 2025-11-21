import { pool } from '../config/database';
import { Order, OrderWithRelations, OrderStatus, PaymentStatus } from '../types';

export class OrderModel {
  /**
   * Create a new order
   */
  static async create(
    userId: string,
    customerName: string,
    customerEmail: string,
    totalAmountUsd: number,
    orderData: {
      customerPhone?: string;
      shippingCountry?: string;
      shippingCity?: string;
      shippingAddress?: string;
      shippingPostalCode?: string;
      productId?: string;
      gridPosition?: number;
      customerNotes?: string;
    }
  ): Promise<Order> {
    // Generate unique order number
    const orderNumber = await this.generateOrderNumber();

    const result = await pool.query(
      `INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_country, shipping_city, shipping_address, shipping_postal_code,
        product_id, grid_position, total_amount_usd, customer_notes,
        order_status, payment_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        orderNumber,
        userId,
        customerName,
        customerEmail,
        orderData.customerPhone,
        orderData.shippingCountry,
        orderData.shippingCity,
        orderData.shippingAddress,
        orderData.shippingPostalCode,
        orderData.productId,
        orderData.gridPosition,
        totalAmountUsd,
        orderData.customerNotes,
        'pending',
        'pending',
      ]
    );

    return result.rows[0];
  }

  /**
   * Generate unique order number
   */
  static async generateOrderNumber(): Promise<string> {
    const result = await pool.query('SELECT generate_order_number() as order_number');
    return result.rows[0].order_number;
  }

  /**
   * Find order by ID
   */
  static async findById(id: string): Promise<Order | null> {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Find order by order number
   */
  static async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const result = await pool.query('SELECT * FROM orders WHERE order_number = $1', [orderNumber]);
    return result.rows[0] || null;
  }

  /**
   * Find order with all relations (user, product, transactions, certificate)
   */
  static async findByIdWithRelations(id: string): Promise<OrderWithRelations | null> {
    const result = await pool.query(
      `SELECT
        o.*,
        json_build_object(
          'id', u.id,
          'email', u.email,
          'full_name', u.full_name,
          'phone', u.phone,
          'role', u.role,
          'is_active', u.is_active,
          'email_verified', u.email_verified,
          'created_at', u.created_at,
          'updated_at', u.updated_at
        ) as user,
        json_build_object(
          'id', p.id,
          'name', p.name,
          'description', p.description,
          'price_usd', p.price_usd,
          'images', p.images,
          'grid_total', p.grid_total,
          'grid_available', p.grid_available,
          'status', p.status,
          'created_at', p.created_at,
          'updated_at', p.updated_at
        ) as product,
        (SELECT json_agg(t.*) FROM transactions t WHERE t.order_id = o.id) as transactions,
        (SELECT row_to_json(c.*) FROM certificates c WHERE c.order_id = o.id) as certificate
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.id = $1`,
      [id]
    );

    if (!result.rows[0]) return null;

    const row = result.rows[0];
    return {
      ...row,
      transactions: row.transactions || [],
      certificate: row.certificate || undefined,
    };
  }

  /**
   * Find orders by user ID
   */
  static async findByUserId(userId: string, limit = 50, offset = 0): Promise<Order[]> {
    const result = await pool.query(
      `SELECT * FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  /**
   * Find all orders with filters and pagination
   */
  static async findAll(options: {
    limit?: number;
    offset?: number;
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    userId?: string;
    searchQuery?: string;
  } = {}): Promise<Order[]> {
    const { limit = 50, offset = 0, orderStatus, paymentStatus, userId, searchQuery } = options;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (orderStatus) {
      query += ` AND order_status = $${paramCount++}`;
      params.push(orderStatus);
    }

    if (paymentStatus) {
      query += ` AND payment_status = $${paramCount++}`;
      params.push(paymentStatus);
    }

    if (userId) {
      query += ` AND user_id = $${paramCount++}`;
      params.push(userId);
    }

    if (searchQuery) {
      query += ` AND (
        order_number ILIKE $${paramCount} OR
        customer_name ILIKE $${paramCount} OR
        customer_email ILIKE $${paramCount}
      )`;
      params.push(`%${searchQuery}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Update order status
   */
  static async updateStatus(
    id: string,
    orderStatus?: OrderStatus,
    paymentStatus?: PaymentStatus,
    adminNotes?: string,
    trackingNumber?: string,
    estimatedDeliveryDate?: Date
  ): Promise<Order> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (orderStatus !== undefined) {
      fields.push(`order_status = $${paramCount++}`);
      values.push(orderStatus);
    }

    if (paymentStatus !== undefined) {
      fields.push(`payment_status = $${paramCount++}`);
      values.push(paymentStatus);
    }

    if (adminNotes !== undefined) {
      fields.push(`admin_notes = $${paramCount++}`);
      values.push(adminNotes);
    }

    if (trackingNumber !== undefined) {
      fields.push(`tracking_number = $${paramCount++}`);
      values.push(trackingNumber);
    }

    if (estimatedDeliveryDate !== undefined) {
      fields.push(`estimated_delivery_date = $${paramCount++}`);
      values.push(estimatedDeliveryDate);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE orders
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Update order details
   */
  static async update(
    id: string,
    updates: Partial<Pick<Order, 'customer_name' | 'customer_email' | 'customer_phone' |
      'shipping_country' | 'shipping_city' | 'shipping_address' | 'shipping_postal_code' |
      'customer_notes' | 'admin_notes' | 'tracking_number' | 'estimated_delivery_date'>>
  ): Promise<Order> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount++}`);
        values.push(value);
      }
    });

    values.push(id);

    const result = await pool.query(
      `UPDATE orders
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Count orders by status
   */
  static async countByStatus(orderStatus?: OrderStatus, paymentStatus?: PaymentStatus): Promise<number> {
    let query = 'SELECT COUNT(*) FROM orders WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (orderStatus) {
      query += ` AND order_status = $${paramCount++}`;
      params.push(orderStatus);
    }

    if (paymentStatus) {
      query += ` AND payment_status = $${paramCount++}`;
      params.push(paymentStatus);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  }

  /**
   * Get total revenue
   */
  static async getTotalRevenue(paymentStatus: PaymentStatus = 'completed'): Promise<number> {
    const result = await pool.query(
      'SELECT COALESCE(SUM(total_amount_usd), 0) as total FROM orders WHERE payment_status = $1',
      [paymentStatus]
    );
    return parseFloat(result.rows[0].total);
  }

  /**
   * Get recent orders with relations
   */
  static async getRecentOrders(limit = 10): Promise<OrderWithRelations[]> {
    const result = await pool.query(
      `SELECT
        o.*,
        json_build_object(
          'id', u.id,
          'email', u.email,
          'full_name', u.full_name,
          'phone', u.phone,
          'role', u.role,
          'is_active', u.is_active,
          'email_verified', u.email_verified,
          'created_at', u.created_at,
          'updated_at', u.updated_at
        ) as user,
        json_build_object(
          'id', p.id,
          'name', p.name,
          'description', p.description,
          'price_usd', p.price_usd,
          'images', p.images,
          'grid_total', p.grid_total,
          'grid_available', p.grid_available,
          'status', p.status,
          'created_at', p.created_at,
          'updated_at', p.updated_at
        ) as product,
        (SELECT json_agg(t.*) FROM transactions t WHERE t.order_id = o.id) as transactions,
        (SELECT row_to_json(c.*) FROM certificates c WHERE c.order_id = o.id) as certificate
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
      LIMIT $1`,
      [limit]
    );

    return result.rows.map(row => ({
      ...row,
      transactions: row.transactions || [],
      certificate: row.certificate || undefined,
    }));
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    const totalOrders = await this.countByStatus();
    const pendingOrders = await this.countByStatus(undefined, 'pending');
    const completedOrders = await this.countByStatus('completed', 'completed');
    const totalRevenue = await this.getTotalRevenue();
    const recentOrders = await this.getRecentOrders(10);

    return {
      total_orders: totalOrders,
      pending_orders: pendingOrders,
      completed_orders: completedOrders,
      total_revenue: totalRevenue,
      recent_orders: recentOrders,
    };
  }

  /**
   * Delete order (should rarely be used, prefer status updates)
   */
  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
  }
}
