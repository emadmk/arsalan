import { pool } from '../config/database';
import { Certificate } from '../types';

export class CertificateModel {
  /**
   * Create a new certificate
   */
  static async create(
    orderId: string,
    certificateData: {
      pdfUrl?: string;
      qrCode?: string;
      isIssued?: boolean;
    } = {}
  ): Promise<Certificate> {
    // Generate unique certificate number
    const certificateNumber = await this.generateCertificateNumber();

    const result = await pool.query(
      `INSERT INTO certificates (order_id, certificate_number, pdf_url, qr_code, is_issued, issued_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        orderId,
        certificateNumber,
        certificateData.pdfUrl,
        certificateData.qrCode,
        certificateData.isIssued || false,
        certificateData.isIssued ? new Date() : null,
      ]
    );

    return result.rows[0];
  }

  /**
   * Generate unique certificate number
   */
  static async generateCertificateNumber(): Promise<string> {
    const result = await pool.query('SELECT generate_certificate_number() as certificate_number');
    return result.rows[0].certificate_number;
  }

  /**
   * Find certificate by ID
   */
  static async findById(id: string): Promise<Certificate | null> {
    const result = await pool.query('SELECT * FROM certificates WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Find certificate by certificate number
   */
  static async findByCertificateNumber(certificateNumber: string): Promise<Certificate | null> {
    const result = await pool.query(
      'SELECT * FROM certificates WHERE certificate_number = $1',
      [certificateNumber]
    );
    return result.rows[0] || null;
  }

  /**
   * Find certificate by order ID
   */
  static async findByOrderId(orderId: string): Promise<Certificate | null> {
    const result = await pool.query(
      'SELECT * FROM certificates WHERE order_id = $1',
      [orderId]
    );
    return result.rows[0] || null;
  }

  /**
   * Find all certificates with filters
   */
  static async findAll(options: {
    limit?: number;
    offset?: number;
    isIssued?: boolean;
  } = {}): Promise<Certificate[]> {
    const { limit = 50, offset = 0, isIssued } = options;

    let query = 'SELECT * FROM certificates WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (isIssued !== undefined) {
      query += ` AND is_issued = $${paramCount++}`;
      params.push(isIssued);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Update certificate
   */
  static async update(
    id: string,
    updates: Partial<Pick<Certificate, 'pdf_url' | 'qr_code' | 'is_issued'>>
  ): Promise<Certificate> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.pdf_url !== undefined) {
      fields.push(`pdf_url = $${paramCount++}`);
      values.push(updates.pdf_url);
    }

    if (updates.qr_code !== undefined) {
      fields.push(`qr_code = $${paramCount++}`);
      values.push(updates.qr_code);
    }

    if (updates.is_issued !== undefined) {
      fields.push(`is_issued = $${paramCount++}`);
      values.push(updates.is_issued);

      // Update issued_at if marking as issued
      if (updates.is_issued) {
        fields.push(`issued_at = COALESCE(issued_at, CURRENT_TIMESTAMP)`);
      }
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE certificates
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Update certificate by order ID
   */
  static async updateByOrderId(
    orderId: string,
    updates: Partial<Pick<Certificate, 'pdf_url' | 'qr_code' | 'is_issued'>>
  ): Promise<Certificate> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.pdf_url !== undefined) {
      fields.push(`pdf_url = $${paramCount++}`);
      values.push(updates.pdf_url);
    }

    if (updates.qr_code !== undefined) {
      fields.push(`qr_code = $${paramCount++}`);
      values.push(updates.qr_code);
    }

    if (updates.is_issued !== undefined) {
      fields.push(`is_issued = $${paramCount++}`);
      values.push(updates.is_issued);

      // Update issued_at if marking as issued
      if (updates.is_issued) {
        fields.push(`issued_at = COALESCE(issued_at, CURRENT_TIMESTAMP)`);
      }
    }

    values.push(orderId);

    const result = await pool.query(
      `UPDATE certificates
       SET ${fields.join(', ')}
       WHERE order_id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Mark certificate as issued
   */
  static async markAsIssued(id: string, pdfUrl: string, qrCode?: string): Promise<Certificate> {
    const result = await pool.query(
      `UPDATE certificates
       SET is_issued = true,
           pdf_url = $1,
           qr_code = $2,
           issued_at = COALESCE(issued_at, CURRENT_TIMESTAMP)
       WHERE id = $3
       RETURNING *`,
      [pdfUrl, qrCode, id]
    );

    return result.rows[0];
  }

  /**
   * Get certificate with order details
   */
  static async findWithOrderDetails(certificateNumber: string) {
    const result = await pool.query(
      `SELECT
        c.*,
        json_build_object(
          'id', o.id,
          'order_number', o.order_number,
          'customer_name', o.customer_name,
          'customer_email', o.customer_email,
          'total_amount_usd', o.total_amount_usd,
          'order_status', o.order_status,
          'created_at', o.created_at
        ) as order,
        json_build_object(
          'id', p.id,
          'name', p.name,
          'description', p.description,
          'price_usd', p.price_usd
        ) as product
      FROM certificates c
      LEFT JOIN orders o ON c.order_id = o.id
      LEFT JOIN products p ON o.product_id = p.id
      WHERE c.certificate_number = $1`,
      [certificateNumber]
    );

    return result.rows[0] || null;
  }

  /**
   * Count certificates
   */
  static async count(isIssued?: boolean): Promise<number> {
    let query = 'SELECT COUNT(*) FROM certificates WHERE 1=1';
    const params: any[] = [];

    if (isIssued !== undefined) {
      query += ' AND is_issued = $1';
      params.push(isIssued);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  }

  /**
   * Get recent certificates
   */
  static async getRecent(limit = 10): Promise<Certificate[]> {
    const result = await pool.query(
      'SELECT * FROM certificates ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  /**
   * Delete certificate (should rarely be used)
   */
  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM certificates WHERE id = $1', [id]);
  }
}
