import { pool } from '../config/database';
import { Setting } from '../types';

export class SettingsModel {
  /**
   * Get a setting by key
   */
  static async get(key: string): Promise<Setting | null> {
    const result = await pool.query('SELECT * FROM settings WHERE key = $1', [key]);
    return result.rows[0] || null;
  }

  /**
   * Get setting value by key
   */
  static async getValue(key: string, defaultValue?: string): Promise<string | null> {
    const setting = await this.get(key);
    return setting?.value || defaultValue || null;
  }

  /**
   * Get all settings
   */
  static async getAll(): Promise<Setting[]> {
    const result = await pool.query('SELECT * FROM settings ORDER BY key');
    return result.rows;
  }

  /**
   * Get settings as key-value object
   */
  static async getAllAsObject(): Promise<Record<string, string>> {
    const settings = await this.getAll();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  }

  /**
   * Set a setting value
   */
  static async set(key: string, value: string, description?: string): Promise<Setting> {
    const result = await pool.query(
      `INSERT INTO settings (key, value, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (key)
       DO UPDATE SET value = $2, description = COALESCE($3, settings.description)
       RETURNING *`,
      [key, value, description]
    );

    return result.rows[0];
  }

  /**
   * Set multiple settings at once
   */
  static async setMultiple(settings: { key: string; value: string; description?: string }[]): Promise<Setting[]> {
    const results: Setting[] = [];

    for (const setting of settings) {
      const result = await this.set(setting.key, setting.value, setting.description);
      results.push(result);
    }

    return results;
  }

  /**
   * Update a setting value
   */
  static async update(key: string, value: string): Promise<Setting> {
    const result = await pool.query(
      'UPDATE settings SET value = $1 WHERE key = $2 RETURNING *',
      [value, key]
    );

    return result.rows[0];
  }

  /**
   * Delete a setting
   */
  static async delete(key: string): Promise<void> {
    await pool.query('DELETE FROM settings WHERE key = $1', [key]);
  }

  /**
   * Check if a setting exists
   */
  static async exists(key: string): Promise<boolean> {
    const result = await pool.query('SELECT 1 FROM settings WHERE key = $1', [key]);
    return result.rows.length > 0;
  }

  /**
   * Get boolean setting value
   */
  static async getBoolean(key: string, defaultValue = false): Promise<boolean> {
    const value = await this.getValue(key);
    if (!value) return defaultValue;

    const normalized = value.toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }

  /**
   * Get numeric setting value
   */
  static async getNumber(key: string, defaultValue = 0): Promise<number> {
    const value = await this.getValue(key);
    if (!value) return defaultValue;

    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Common setting getters
   */
  static async getSiteName(): Promise<string> {
    return (await this.getValue('site_name')) || 'Persian Kerman Carpet';
  }

  static async getSiteEmail(): Promise<string> {
    return (await this.getValue('site_email')) || 'info@persiancarpet.com';
  }

  static async isSalesEnabled(): Promise<boolean> {
    return this.getBoolean('sales_enabled', true);
  }

  static async getDefaultProductPrice(): Promise<number> {
    return this.getNumber('default_product_price', 100);
  }

  static async isSmtpConfigured(): Promise<boolean> {
    return this.getBoolean('smtp_configured', false);
  }

  static async isNowPaymentsConfigured(): Promise<boolean> {
    return this.getBoolean('nowpayments_configured', false);
  }

  /**
   * Common setting setters
   */
  static async setSalesEnabled(enabled: boolean): Promise<Setting> {
    return this.set('sales_enabled', enabled.toString(), 'Enable/disable sales');
  }

  static async setSmtpConfigured(configured: boolean): Promise<Setting> {
    return this.set('smtp_configured', configured.toString(), 'Whether SMTP is configured');
  }

  static async setNowPaymentsConfigured(configured: boolean): Promise<Setting> {
    return this.set('nowpayments_configured', configured.toString(), 'Whether NOWPayments is configured');
  }
}
