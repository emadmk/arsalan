import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import {
  NOWPaymentsCreatePaymentRequest,
  NOWPaymentsPaymentResponse,
  NOWPaymentsIPNPayload,
} from '../types';

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY || '';
const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET || '';

export class NOWPaymentsService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: NOWPAYMENTS_API_URL,
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Get API status
   */
  async getStatus(): Promise<{ message: string }> {
    const response = await this.api.get('/status');
    return response.data;
  }

  /**
   * Get list of available currencies
   */
  async getAvailableCurrencies(): Promise<{ currencies: string[] }> {
    const response = await this.api.get('/currencies');
    return response.data;
  }

  /**
   * Get estimated price in crypto for a given amount in fiat
   */
  async getEstimatedPrice(
    amount: number,
    currencyFrom: string = 'USD',
    currencyTo: string
  ): Promise<{
    currency_from: string;
    amount_from: number;
    currency_to: string;
    estimated_amount: number;
  }> {
    const response = await this.api.get('/estimate', {
      params: {
        amount,
        currency_from: currencyFrom,
        currency_to: currencyTo,
      },
    });
    return response.data;
  }

  /**
   * Get minimum payment amount for a currency
   */
  async getMinimumPaymentAmount(
    currencyFrom: string,
    currencyTo: string
  ): Promise<{
    currency_from: string;
    currency_to: string;
    min_amount: number;
  }> {
    const response = await this.api.get('/min-amount', {
      params: {
        currency_from: currencyFrom,
        currency_to: currencyTo,
      },
    });
    return response.data;
  }

  /**
   * Create a payment
   */
  async createPayment(
    paymentData: NOWPaymentsCreatePaymentRequest
  ): Promise<NOWPaymentsPaymentResponse> {
    const response = await this.api.post('/payment', paymentData);
    return response.data;
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<NOWPaymentsPaymentResponse> {
    const response = await this.api.get(`/payment/${paymentId}`);
    return response.data;
  }

  /**
   * Get list of payments
   */
  async getPaymentsList(params: {
    limit?: number;
    page?: number;
    sortBy?: string;
    orderBy?: 'asc' | 'desc';
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<{
    data: NOWPaymentsPaymentResponse[];
    total: number;
    page: number;
  }> {
    const response = await this.api.get('/payment', { params });
    return response.data;
  }

  /**
   * Verify IPN (Instant Payment Notification) signature
   */
  verifyIPNSignature(payload: string, signature: string): boolean {
    const hmac = crypto.createHmac('sha512', NOWPAYMENTS_IPN_SECRET);
    hmac.update(payload);
    const calculatedSignature = hmac.digest('hex');
    return calculatedSignature === signature;
  }

  /**
   * Create an invoice
   */
  async createInvoice(invoiceData: {
    price_amount: number;
    price_currency: string;
    pay_currency?: string;
    ipn_callback_url: string;
    order_id: string;
    order_description: string;
    success_url?: string;
    cancel_url?: string;
  }): Promise<{
    id: string;
    token_id: string;
    order_id: string;
    order_description: string;
    price_amount: string;
    price_currency: string;
    pay_currency: string;
    ipn_callback_url: string;
    invoice_url: string;
    success_url: string;
    cancel_url: string;
    created_at: string;
    updated_at: string;
  }> {
    const response = await this.api.post('/invoice', invoiceData);
    return response.data;
  }

  /**
   * Get invoice details
   */
  async getInvoice(invoiceId: string): Promise<any> {
    const response = await this.api.get(`/invoice/${invoiceId}`);
    return response.data;
  }

  /**
   * Get supported crypto currencies with details
   */
  async getSupportedCurrencies(): Promise<
    Array<{
      code: string;
      name: string;
      network?: string;
      is_popular?: boolean;
    }>
  > {
    try {
      const response = await this.getAvailableCurrencies();

      // Map currency codes to names and add popular flag
      const popularCurrencies = ['btc', 'eth', 'usdt', 'usdc', 'bnb', 'ada', 'sol', 'dot'];

      return response.currencies.map(code => ({
        code: code.toUpperCase(),
        name: this.getCurrencyName(code),
        is_popular: popularCurrencies.includes(code.toLowerCase()),
      }));
    } catch (error) {
      console.error('Error fetching currencies:', error);
      return this.getDefaultCurrencies();
    }
  }

  /**
   * Get currency name from code
   */
  private getCurrencyName(code: string): string {
    const currencyNames: Record<string, string> = {
      btc: 'Bitcoin',
      eth: 'Ethereum',
      usdt: 'Tether USD',
      usdc: 'USD Coin',
      bnb: 'Binance Coin',
      ada: 'Cardano',
      sol: 'Solana',
      dot: 'Polkadot',
      matic: 'Polygon',
      trx: 'TRON',
      ltc: 'Litecoin',
      bch: 'Bitcoin Cash',
      xrp: 'Ripple',
      doge: 'Dogecoin',
      shib: 'Shiba Inu',
      avax: 'Avalanche',
      link: 'Chainlink',
      xlm: 'Stellar',
      atom: 'Cosmos',
      etc: 'Ethereum Classic',
    };

    return currencyNames[code.toLowerCase()] || code.toUpperCase();
  }

  /**
   * Get default currencies if API fails
   */
  private getDefaultCurrencies() {
    return [
      { code: 'BTC', name: 'Bitcoin', is_popular: true },
      { code: 'ETH', name: 'Ethereum', is_popular: true },
      { code: 'USDT', name: 'Tether USD', is_popular: true },
      { code: 'USDC', name: 'USD Coin', is_popular: true },
      { code: 'BNB', name: 'Binance Coin', is_popular: true },
      { code: 'ADA', name: 'Cardano', is_popular: true },
      { code: 'SOL', name: 'Solana', is_popular: true },
      { code: 'DOT', name: 'Polkadot', is_popular: true },
      { code: 'MATIC', name: 'Polygon', is_popular: false },
      { code: 'TRX', name: 'TRON', is_popular: false },
      { code: 'LTC', name: 'Litecoin', is_popular: false },
      { code: 'BCH', name: 'Bitcoin Cash', is_popular: false },
      { code: 'XRP', name: 'Ripple', is_popular: false },
      { code: 'DOGE', name: 'Dogecoin', is_popular: false },
    ];
  }

  /**
   * Check if NOWPayments is configured
   */
  isConfigured(): boolean {
    return !!NOWPAYMENTS_API_KEY && !!NOWPAYMENTS_IPN_SECRET;
  }
}

// Export singleton instance
export const nowPaymentsService = new NOWPaymentsService();
