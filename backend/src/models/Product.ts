import { pool } from '../config/database';
import { Product } from '../types';

export class ProductModel {
  /**
   * Create a new product
   */
  static async create(
    name: string,
    priceUsd: number,
    description?: string,
    images?: string[],
    gridTotal: number = 100,
    status: 'active' | 'inactive' | 'sold_out' = 'active'
  ): Promise<Product> {
    const result = await pool.query(
      `INSERT INTO products (name, description, price_usd, images, grid_total, grid_available, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, priceUsd, JSON.stringify(images || []), gridTotal, gridTotal, status]
    );

    const row = result.rows[0];
    return {
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    };
  }

  /**
   * Find product by ID
   */
  static async findById(id: string): Promise<Product | null> {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (!result.rows[0]) return null;

    const row = result.rows[0];
    return {
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    };
  }

  /**
   * Find all products with filters
   */
  static async findAll(options: {
    limit?: number;
    offset?: number;
    status?: 'active' | 'inactive' | 'sold_out';
  } = {}): Promise<Product[]> {
    const { limit = 50, offset = 0, status } = options;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount++}`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return result.rows.map((row: any) => ({
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    }));
  }

  /**
   * Find active products only
   */
  static async findActive(limit = 50, offset = 0): Promise<Product[]> {
    return this.findAll({ limit, offset, status: 'active' });
  }

  /**
   * Update product
   */
  static async update(
    id: string,
    updates: Partial<Pick<Product, 'name' | 'description' | 'price_usd' | 'images' | 'grid_total' | 'grid_available' | 'status'>>
  ): Promise<Product> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }

    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }

    if (updates.price_usd !== undefined) {
      fields.push(`price_usd = $${paramCount++}`);
      values.push(updates.price_usd);
    }

    if (updates.images !== undefined) {
      fields.push(`images = $${paramCount++}`);
      values.push(JSON.stringify(updates.images));
    }

    if (updates.grid_total !== undefined) {
      fields.push(`grid_total = $${paramCount++}`);
      values.push(updates.grid_total);
    }

    if (updates.grid_available !== undefined) {
      fields.push(`grid_available = $${paramCount++}`);
      values.push(updates.grid_available);
    }

    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE products
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    const row = result.rows[0];
    return {
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    };
  }

  /**
   * Reserve a grid position (decrease available count)
   */
  static async reserveGrid(id: string, positions: number = 1): Promise<Product> {
    const result = await pool.query(
      `UPDATE products
       SET grid_available = GREATEST(0, grid_available - $1)
       WHERE id = $2
       RETURNING *`,
      [positions, id]
    );

    const row = result.rows[0];
    return {
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    };
  }

  /**
   * Release a grid position (increase available count)
   */
  static async releaseGrid(id: string, positions: number = 1): Promise<Product> {
    const result = await pool.query(
      `UPDATE products
       SET grid_available = LEAST(grid_total, grid_available + $1)
       WHERE id = $2
       RETURNING *`,
      [positions, id]
    );

    const row = result.rows[0];
    return {
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    };
  }

  /**
   * Check if grid position is available
   */
  static async isGridAvailable(id: string): Promise<boolean> {
    const result = await pool.query(
      'SELECT grid_available FROM products WHERE id = $1',
      [id]
    );

    if (!result.rows[0]) return false;
    return result.rows[0].grid_available > 0;
  }

  /**
   * Update product status based on grid availability
   */
  static async updateStatusByAvailability(id: string): Promise<Product> {
    const result = await pool.query(
      `UPDATE products
       SET status = CASE
         WHEN grid_available = 0 THEN 'sold_out'
         WHEN status = 'sold_out' AND grid_available > 0 THEN 'active'
         ELSE status
       END
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    const row = result.rows[0];
    return {
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    };
  }

  /**
   * Count products
   */
  static async count(status?: 'active' | 'inactive' | 'sold_out'): Promise<number> {
    let query = 'SELECT COUNT(*) FROM products WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = $1';
      params.push(status);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  }

  /**
   * Delete product
   */
  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
  }
}
