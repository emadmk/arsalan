import nodemailer, { Transporter } from 'nodemailer';
import {
  OrderConfirmationEmailData,
  PaymentReceivedEmailData,
  CertificateEmailData,
} from '../types';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    if (this.isConfigured()) {
      this.initializeTransporter();
    }
  }

  /**
   * Initialize email transporter
   */
  private initializeTransporter() {
    this.transporter = nodemailer.createTransporter({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  /**
   * Check if email service is configured
   */
  isConfigured(): boolean {
    return !!SMTP_USER && !!SMTP_PASS;
  }

  /**
   * Send email
   */
  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      console.log('[Email] Email service not configured, skipping email to:', to);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"Persian Kerman Carpet" <${SMTP_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`[Email] Sent email to ${to}: ${subject}`);
    } catch (error) {
      console.error('[Email] Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(
    email: string,
    data: OrderConfirmationEmailData
  ): Promise<void> {
    const subject = `Order Confirmation - ${data.orderNumber}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for your order</p>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>We've received your order and it's being processed. You'll receive another email once your payment is confirmed.</p>

            <div class="order-details">
              <h2 style="margin-top: 0;">Order Details</h2>
              <div class="detail-row">
                <span><strong>Order Number:</strong></span>
                <span>${data.orderNumber}</span>
              </div>
              <div class="detail-row">
                <span><strong>Product:</strong></span>
                <span>${data.productName}</span>
              </div>
              <div class="detail-row">
                <span><strong>Total Amount:</strong></span>
                <span>$${data.totalAmount.toFixed(2)} USD</span>
              </div>
              <div class="detail-row">
                <span><strong>Order Date:</strong></span>
                <span>${data.orderDate}</span>
              </div>
            </div>

            <p>To complete your purchase, please proceed with the payment using your preferred cryptocurrency.</p>

            <a href="${FRONTEND_URL}/orders/${data.orderNumber}" class="button">View Order</a>

            <p>If you have any questions, please don't hesitate to contact us.</p>

            <p>Best regards,<br>Persian Kerman Carpet Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Persian Kerman Carpet. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Send payment received email
   */
  async sendPaymentReceived(
    email: string,
    data: PaymentReceivedEmailData
  ): Promise<void> {
    const subject = `Payment Received - ${data.orderNumber}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✓</div>
            <h1>Payment Received!</h1>
            <p>Your payment has been confirmed</p>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>Great news! We've received and confirmed your payment. Your order is now being processed.</p>

            <div class="payment-details">
              <h2 style="margin-top: 0;">Payment Details</h2>
              <div class="detail-row">
                <span><strong>Order Number:</strong></span>
                <span>${data.orderNumber}</span>
              </div>
              <div class="detail-row">
                <span><strong>Cryptocurrency:</strong></span>
                <span>${data.cryptoCurrency}</span>
              </div>
              <div class="detail-row">
                <span><strong>Amount Paid:</strong></span>
                <span>${data.cryptoAmount} ${data.cryptoCurrency}</span>
              </div>
              <div class="detail-row">
                <span><strong>USD Value:</strong></span>
                <span>$${data.usdAmount.toFixed(2)} USD</span>
              </div>
              ${
                data.transactionHash
                  ? `
              <div class="detail-row">
                <span><strong>Transaction Hash:</strong></span>
                <span style="font-size: 12px; word-break: break-all;">${data.transactionHash}</span>
              </div>
              `
                  : ''
              }
            </div>

            <p>Your Persian Kerman Carpet will now enter production. We'll keep you updated on the progress and send you a certificate of authenticity once completed.</p>

            <a href="${FRONTEND_URL}/dashboard" class="button">View Dashboard</a>

            <p>Thank you for your purchase!</p>

            <p>Best regards,<br>Persian Kerman Carpet Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Persian Kerman Carpet. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Send certificate email
   */
  async sendCertificate(email: string, data: CertificateEmailData): Promise<void> {
    const subject = `Your Certificate of Authenticity - ${data.orderNumber}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .certificate-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 Certificate Ready!</h1>
            <p>Your Certificate of Authenticity is now available</p>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>Congratulations! Your Persian Kerman Carpet is complete, and your Certificate of Authenticity is now ready for download.</p>

            <div class="certificate-info">
              <h2 style="margin-top: 0;">Certificate Information</h2>
              <p><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p><strong>Certificate Number:</strong> ${data.certificateNumber}</p>
              <p style="margin-top: 30px;">This certificate verifies the authenticity and craftsmanship of your Persian Kerman Carpet.</p>
            </div>

            <div style="text-align: center;">
              <a href="${data.certificatePdfUrl}" class="button">Download Certificate</a>
            </div>

            <p>Please keep this certificate safe as proof of authenticity and ownership.</p>

            <p>Thank you for choosing Persian Kerman Carpet!</p>

            <p>Best regards,<br>Persian Kerman Carpet Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Persian Kerman Carpet. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Send order status update email
   */
  async sendOrderStatusUpdate(
    email: string,
    customerName: string,
    orderNumber: string,
    status: string,
    message: string
  ): Promise<void> {
    const subject = `Order Update - ${orderNumber}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Update</h1>
            <p>Your order status has been updated</p>
          </div>
          <div class="content">
            <p>Dear ${customerName},</p>

            <div class="status-box">
              <h2 style="margin-top: 0;">Order ${orderNumber}</h2>
              <p><strong>New Status:</strong> ${status}</p>
              <p style="margin-top: 20px;">${message}</p>
            </div>

            <div style="text-align: center;">
              <a href="${FRONTEND_URL}/dashboard" class="button">View Order Details</a>
            </div>

            <p>Thank you for your patience!</p>

            <p>Best regards,<br>Persian Kerman Carpet Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Persian Kerman Carpet. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Verify SMTP configuration by sending a test email
   */
  async verifyConfiguration(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('[Email] SMTP configuration verified successfully');
      return true;
    } catch (error) {
      console.error('[Email] SMTP configuration verification failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
