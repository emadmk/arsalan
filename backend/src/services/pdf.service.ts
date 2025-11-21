import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { Order, Certificate } from '../types';

const CERTIFICATES_DIR = process.env.CERTIFICATES_DIR || path.join(__dirname, '../../certificates');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export class PDFService {
  constructor() {
    // Ensure certificates directory exists
    if (!fs.existsSync(CERTIFICATES_DIR)) {
      fs.mkdirSync(CERTIFICATES_DIR, { recursive: true });
    }
  }

  /**
   * Generate certificate PDF
   */
  async generateCertificate(
    order: Order,
    certificate: Certificate,
    productName: string
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const filename = `certificate-${certificate.certificate_number}.pdf`;
        const filepath = path.join(CERTIFICATES_DIR, filename);

        // Generate QR code
        const qrCodeUrl = `${FRONTEND_URL}/verify/${certificate.certificate_number}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
          width: 150,
          margin: 1,
        });

        // Create PDF document
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const writeStream = fs.createWriteStream(filepath);
        doc.pipe(writeStream);

        // Add ornamental border
        doc
          .lineWidth(3)
          .strokeColor('#d4af37')
          .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
          .stroke();

        doc
          .lineWidth(1)
          .strokeColor('#d4af37')
          .rect(35, 35, doc.page.width - 70, doc.page.height - 70)
          .stroke();

        // Header
        doc
          .fontSize(32)
          .font('Helvetica-Bold')
          .fillColor('#2c3e50')
          .text('CERTIFICATE', 0, 80, { align: 'center' });

        doc
          .fontSize(20)
          .font('Helvetica')
          .fillColor('#7f8c8d')
          .text('OF AUTHENTICITY', 0, 120, { align: 'center' });

        // Decorative line
        const centerX = doc.page.width / 2;
        doc
          .moveTo(centerX - 100, 160)
          .lineTo(centerX + 100, 160)
          .strokeColor('#d4af37')
          .lineWidth(2)
          .stroke();

        // Main content
        doc
          .fontSize(14)
          .font('Helvetica')
          .fillColor('#2c3e50')
          .text('This certifies that', 0, 200, { align: 'center' });

        doc
          .fontSize(22)
          .font('Helvetica-Bold')
          .fillColor('#c0392b')
          .text(order.customer_name.toUpperCase(), 0, 230, { align: 'center' });

        doc
          .fontSize(14)
          .font('Helvetica')
          .fillColor('#2c3e50')
          .text('is the authentic owner of', 0, 270, { align: 'center' });

        doc
          .fontSize(18)
          .font('Helvetica-Bold')
          .fillColor('#8e44ad')
          .text(productName, 0, 300, { align: 'center', width: doc.page.width });

        // Details box
        const boxY = 360;
        const boxHeight = 180;
        doc
          .rect(100, boxY, doc.page.width - 200, boxHeight)
          .fillAndStroke('#f8f9fa', '#d4af37');

        doc
          .fontSize(11)
          .font('Helvetica')
          .fillColor('#2c3e50')
          .text('Certificate Number:', 120, boxY + 20)
          .font('Helvetica-Bold')
          .text(certificate.certificate_number, 260, boxY + 20);

        doc
          .font('Helvetica')
          .text('Order Number:', 120, boxY + 45)
          .font('Helvetica-Bold')
          .text(order.order_number, 260, boxY + 45);

        doc
          .font('Helvetica')
          .text('Issue Date:', 120, boxY + 70)
          .font('Helvetica-Bold')
          .text(new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }), 260, boxY + 70);

        doc
          .font('Helvetica')
          .text('Grid Position:', 120, boxY + 95)
          .font('Helvetica-Bold')
          .text(order.grid_position?.toString() || 'N/A', 260, boxY + 95);

        doc
          .font('Helvetica')
          .text('Order Amount:', 120, boxY + 120)
          .font('Helvetica-Bold')
          .text(`$${order.total_amount_usd.toFixed(2)} USD`, 260, boxY + 120);

        // QR Code
        const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
        doc.image(qrBuffer, doc.page.width - 180, boxY + 15, {
          width: 80,
          height: 80,
        });

        doc
          .fontSize(8)
          .font('Helvetica')
          .fillColor('#7f8c8d')
          .text('Scan to verify', doc.page.width - 180, boxY + 100, {
            width: 80,
            align: 'center',
          });

        // Authenticity statement
        doc
          .fontSize(10)
          .font('Helvetica-Oblique')
          .fillColor('#7f8c8d')
          .text(
            'This certificate verifies the authenticity and ownership of the above-mentioned Persian Kerman Carpet. ' +
            'It is hand-woven by master artisans using traditional techniques passed down through generations.',
            80,
            580,
            { width: doc.page.width - 160, align: 'center' }
          );

        // Signature line
        const signY = 660;
        doc
          .moveTo(100, signY)
          .lineTo(250, signY)
          .strokeColor('#2c3e50')
          .lineWidth(1)
          .stroke();

        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#2c3e50')
          .text('Authorized Signature', 100, signY + 10, { width: 150, align: 'center' });

        // Footer
        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#95a5a6')
          .text(
            'Persian Kerman Carpet | www.persiankermancarpet.com',
            0,
            doc.page.height - 80,
            { align: 'center' }
          );

        doc
          .fontSize(8)
          .fillColor('#bdc3c7')
          .text(
            `Certificate generated on ${new Date().toLocaleString()}`,
            0,
            doc.page.height - 60,
            { align: 'center' }
          );

        // Finalize PDF
        doc.end();

        writeStream.on('finish', () => {
          resolve(filepath);
        });

        writeStream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get certificate file path
   */
  getCertificatePath(certificateNumber: string): string {
    return path.join(CERTIFICATES_DIR, `certificate-${certificateNumber}.pdf`);
  }

  /**
   * Check if certificate exists
   */
  certificateExists(certificateNumber: string): boolean {
    const filepath = this.getCertificatePath(certificateNumber);
    return fs.existsSync(filepath);
  }

  /**
   * Delete certificate file
   */
  deleteCertificate(certificateNumber: string): boolean {
    try {
      const filepath = this.getCertificatePath(certificateNumber);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting certificate:', error);
      return false;
    }
  }

  /**
   * Get certificate URL
   */
  getCertificateUrl(certificateNumber: string): string {
    return `${FRONTEND_URL}/api/certificates/${certificateNumber}/download`;
  }
}

// Export singleton instance
export const pdfService = new PDFService();
