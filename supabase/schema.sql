-- ==========================================================
-- Mini E-Commerce & Realtime Dashboard Database Schema
-- Run this script in your Supabase SQL Editor
-- ==========================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create/Extend Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT,
    category VARCHAR(100) DEFAULT 'General',
    seller_email VARCHAR(255) DEFAULT 'official@novastore.com',
    seller_name VARCHAR(255) DEFAULT 'NovaStore Official',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure seller columns exist if table was previously created
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS seller_email VARCHAR(255) DEFAULT 'official@novastore.com',
ADD COLUMN IF NOT EXISTS seller_name VARCHAR(255) DEFAULT 'NovaStore Official';

-- 3. Create/Extend Orders Table (with Courier Logistics, 2.5% Fee, and Payment Proof)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_address TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    admin_fee NUMERIC(12, 2) DEFAULT 0,
    shipping_courier VARCHAR(100) DEFAULT 'JNE Express - Reguler',
    shipping_cost NUMERIC(12, 2) DEFAULT 0,
    destination_lat NUMERIC(10, 7),
    destination_lng NUMERIC(10, 7),
    payment_proof_url TEXT,
    payment_verified BOOLEAN DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, completed, cancelled
    payment_method VARCHAR(50) DEFAULT 'qris',
    seller_email VARCHAR(255) DEFAULT 'official@novastore.com',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all extended columns exist if table was previously created
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS admin_fee NUMERIC(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_courier VARCHAR(100) DEFAULT 'JNE Express - Reguler',
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS destination_lat NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS destination_lng NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS seller_email VARCHAR(255) DEFAULT 'official@novastore.com';

-- 4. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.orders(seller_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies: Products
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" 
ON public.products FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" 
ON public.products FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

-- 8. RLS Policies: Orders
DROP POLICY IF EXISTS "Guests can create orders" ON public.orders;
CREATE POLICY "Guests can create orders" 
ON public.orders FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow view all orders" ON public.orders;
CREATE POLICY "Allow view all orders" 
ON public.orders FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow update orders" ON public.orders;
CREATE POLICY "Allow update orders" 
ON public.orders FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Allow delete orders" ON public.orders;
CREATE POLICY "Allow delete orders" 
ON public.orders FOR DELETE 
TO public 
USING (true);

-- 9. RLS Policies: Order Items
DROP POLICY IF EXISTS "Guests can create order items" ON public.order_items;
CREATE POLICY "Guests can create order items" 
ON public.order_items FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow view all order items" ON public.order_items;
CREATE POLICY "Allow view all order items" 
ON public.order_items FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Admins can delete order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow delete order items" ON public.order_items;
CREATE POLICY "Allow delete order items" 
ON public.order_items FOR DELETE 
TO public 
USING (true);

-- 10. Enable Supabase Realtime Subscriptions
DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION 
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
EXCEPTION 
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
END $$;
