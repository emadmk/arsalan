// User Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  wallet_address?: string;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  images: string[];
  grid_positions_total: number;
  grid_positions_available: number;
  status: 'active' | 'sold_out' | 'coming_soon';
  created_at: string;
  updated_at: string;
}

// Order Types
export type OrderStatus =
  | 'pending_payment'
  | 'payment_received'
  | 'in_production'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  grid_position?: number;
  status: OrderStatus;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  total_amount_usd: number;
  created_at: string;
  updated_at: string;

  // Relations
  user?: User;
  product?: Product;
  transactions?: Transaction[];
}

// Transaction Types
export type CryptoSymbol =
  | 'BTC'
  | 'ETH'
  | 'USDT'
  | 'USDC'
  | 'BNB'
  | 'SOL'
  | 'ADA'
  | 'MATIC'
  | 'DOT'
  | 'AVAX';

export interface Transaction {
  id: string;
  order_id: string;
  user_id: string;
  transaction_hash?: string;
  crypto_currency: CryptoSymbol;
  crypto_amount: number;
  usd_amount: number;
  exchange_rate: number;
  wallet_from?: string;
  wallet_to: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations?: number;
  created_at: string;
  updated_at: string;

  // Relations
  order?: Order;
}

// Crypto Price Types
export interface CryptoPrice {
  symbol: CryptoSymbol;
  name: string;
  price_usd: number;
  change_24h: number;
  icon?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  total_orders: number;
  total_revenue_usd: number;
  pending_orders: number;
  completed_orders: number;
  total_customers: number;
  recent_transactions: Transaction[];
}

// Grid Selection Types
export interface GridPosition {
  position: number;
  available: boolean;
  reserved_by?: string;
  reserved_at?: string;
}

// Certificate Types
export interface Certificate {
  id: string;
  order_id: string;
  certificate_number: string;
  issued_at: string;
  pdf_url?: string;
}
