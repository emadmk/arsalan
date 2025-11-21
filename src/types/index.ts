export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_id?: string;
  amount_usd: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'expired';
  status: 'pending_payment' | 'payment_received' | 'in_production' | 'completed' | 'cancelled';
  payment_id?: string;
  payment_address?: string;
  crypto_amount?: number;
  crypto_currency?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  image_url?: string;
  stock: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  order_id: string;
  certificate_url: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  order_id: string;
  tx_hash?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}
