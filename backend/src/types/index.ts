// Complete TypeScript types for the entire application

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name?: string;
  phone?: string;
  role: 'admin' | 'customer';
  is_active: boolean;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserPublic extends Omit<User, 'password_hash'> {}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price_usd: number;
  images: string[];
  grid_total: number;
  grid_available: number;
  status: 'active' | 'inactive' | 'sold_out';
  created_at: Date;
  updated_at: Date;
}

export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'payment_received'
  | 'in_production'
  | 'quality_check'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;

  // Customer Information
  customer_name: string;
  customer_email: string;
  customer_phone?: string;

  // Shipping Address
  shipping_country?: string;
  shipping_city?: string;
  shipping_address?: string;
  shipping_postal_code?: string;

  // Order Details
  product_id?: string;
  grid_position?: number;
  total_amount_usd: number;

  // Status
  order_status: OrderStatus;
  payment_status: PaymentStatus;

  // Notes
  customer_notes?: string;
  admin_notes?: string;

  // Tracking
  tracking_number?: string;
  estimated_delivery_date?: Date;

  created_at: Date;
  updated_at: Date;
}

export interface OrderWithRelations extends Order {
  user?: UserPublic;
  product?: Product;
  transactions?: Transaction[];
  certificate?: Certificate;
}

export interface Transaction {
  id: string;
  order_id: string;
  user_id: string;

  // NOWPayments Data
  payment_id?: string;
  invoice_id?: string;
  payment_status: string;

  // Crypto Details
  pay_currency: string;
  pay_amount?: number;
  actually_paid?: number;
  price_amount: number;
  price_currency: string;

  // Blockchain Info
  pay_address?: string;
  payin_hash?: string;
  outcome_amount?: number;
  outcome_currency?: string;

  // URLs
  payment_url?: string;
  invoice_url?: string;

  created_at: Date;
  updated_at: Date;
  confirmed_at?: Date;
  expires_at?: Date;
}

export interface Certificate {
  id: string;
  order_id: string;
  certificate_number: string;
  issued_at: Date;
  pdf_url?: string;
  qr_code?: string;
  is_issued: boolean;
  created_at: Date;
}

export interface Setting {
  key: string;
  value: string;
  description?: string;
  updated_at: Date;
}

// Request/Response Types

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserPublic;
  token: string;
  refreshToken?: string;
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_country?: string;
  shipping_city?: string;
  shipping_address?: string;
  shipping_postal_code?: string;
  product_id: string;
  grid_position?: number;
  customer_notes?: string;
}

export interface CreatePaymentRequest {
  order_id: string;
  pay_currency: string;
}

export interface UpdateOrderStatusRequest {
  order_id: string;
  order_status?: OrderStatus;
  payment_status?: PaymentStatus;
  admin_notes?: string;
  tracking_number?: string;
}

export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
  recent_orders: OrderWithRelations[];
  recent_transactions: Transaction[];
}

// NOWPayments API Types

export interface NOWPaymentsCreatePaymentRequest {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  ipn_callback_url: string;
  order_id: string;
  order_description: string;
}

export interface NOWPaymentsPaymentResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  payin_extra_id?: string;
  ipn_callback_url: string;
  created_at: string;
  updated_at: string;
  purchase_id: string;
  smart_contract?: string;
  network?: string;
  network_precision?: number;
  time_limit?: string;
  burning_percent?: number;
  expiration_estimate_date: string;
}

export interface NOWPaymentsIPNPayload {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  purchase_id: string;
  outcome_amount: number;
  outcome_currency: string;
  payin_hash?: string;
  created_at: string;
  updated_at: string;
}

// Email Template Data

export interface OrderConfirmationEmailData {
  customerName: string;
  orderNumber: string;
  productName: string;
  totalAmount: number;
  orderDate: string;
}

export interface PaymentReceivedEmailData {
  customerName: string;
  orderNumber: string;
  cryptoCurrency: string;
  cryptoAmount: number;
  usdAmount: number;
  transactionHash?: string;
}

export interface CertificateEmailData {
  customerName: string;
  orderNumber: string;
  certificateNumber: string;
  certificatePdfUrl: string;
}

// Error Types

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}
