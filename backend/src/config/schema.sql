-- Persian Carpet E-commerce Database Schema
-- Complete schema with all tables, indexes, and triggers

-- Drop existing tables if they exist
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_usd DECIMAL(10, 2) NOT NULL,
    images JSONB DEFAULT '[]',
    grid_total INTEGER DEFAULT 100,
    grid_available INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),

    -- Shipping Address
    shipping_country VARCHAR(100),
    shipping_city VARCHAR(100),
    shipping_address TEXT,
    shipping_postal_code VARCHAR(20),

    -- Order Details
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    grid_position INTEGER,
    total_amount_usd DECIMAL(10, 2) NOT NULL,

    -- Status
    order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN (
        'pending',
        'payment_pending',
        'payment_received',
        'in_production',
        'quality_check',
        'ready_to_ship',
        'shipped',
        'delivered',
        'completed',
        'cancelled',
        'refunded'
    )),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN (
        'pending',
        'processing',
        'completed',
        'failed',
        'refunded',
        'partially_refunded'
    )),

    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,

    -- Tracking
    tracking_number VARCHAR(100),
    estimated_delivery_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table (Crypto Payments)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- NOWPayments Data
    payment_id VARCHAR(255) UNIQUE,
    invoice_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'waiting',

    -- Crypto Details
    pay_currency VARCHAR(20) NOT NULL,
    pay_amount DECIMAL(18, 8),
    actually_paid DECIMAL(18, 8),
    price_amount DECIMAL(10, 2) NOT NULL,
    price_currency VARCHAR(10) DEFAULT 'USD',

    -- Blockchain Info
    pay_address TEXT,
    payin_hash TEXT,
    outcome_amount DECIMAL(18, 8),
    outcome_currency VARCHAR(20),

    -- NOWPayments URLs
    payment_url TEXT,
    invoice_url TEXT,

    -- Status & Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- Certificates Table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_url TEXT,
    qr_code TEXT,
    is_issued BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table (for site configuration)
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_payment_id ON transactions(payment_id);
CREATE INDEX idx_transactions_status ON transactions(payment_status);
CREATE INDEX idx_certificates_order_id ON certificates(order_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
BEGIN
    new_number := 'ORD-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' ||
                  LPAD(CAST(FLOOR(RANDOM() * 10000) AS TEXT), 4, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
BEGIN
    new_number := 'CERT-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYY') || '-' ||
                  LPAD(CAST(FLOOR(RANDOM() * 100000) AS TEXT), 5, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('site_name', 'Persian Kerman Carpet', 'Site name'),
('site_email', 'info@persiancarpet.com', 'Contact email'),
('sales_enabled', 'true', 'Enable/disable sales'),
('default_product_price', '100', 'Default reservation price in USD'),
('smtp_configured', 'false', 'Whether SMTP is configured'),
('nowpayments_configured', 'false', 'Whether NOWPayments is configured')
ON CONFLICT (key) DO NOTHING;

-- Insert default admin user (password: Admin123!@#)
-- This will be created by seed script with proper bcrypt hash

COMMENT ON TABLE users IS 'User accounts for customers and admins';
COMMENT ON TABLE products IS 'Persian carpet products';
COMMENT ON TABLE orders IS 'Customer orders with full details';
COMMENT ON TABLE transactions IS 'Crypto payment transactions via NOWPayments';
COMMENT ON TABLE certificates IS 'Authenticity certificates for completed orders';
COMMENT ON TABLE settings IS 'Site-wide configuration settings';
