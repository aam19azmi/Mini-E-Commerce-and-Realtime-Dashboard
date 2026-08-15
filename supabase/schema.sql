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

-- 11. Atomic Stored Procedures for Stock Management & Full Reset
CREATE OR REPLACE FUNCTION public.deduct_product_stock(p_product_id UUID, p_quantity INT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.products
    SET stock = GREATEST(0, stock - p_quantity)
    WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.reset_to_pristine_catalog()
RETURNS VOID AS $$
BEGIN
    TRUNCATE TABLE public.order_items, public.orders, public.products CASCADE;
    
    INSERT INTO public.products (id, name, description, price, stock, image_url, category, seller_email, seller_name)
    VALUES
        ('00000000-0000-4000-8000-000000000001', 'Apex Pro RGB Mechanical Keyboard', 'Aircraft-grade aluminum frame, OmniPoint adjustable switches, and per-key RGB illumination with USB passthrough.', 1850000.00, 35, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', 'Electronics', 'official@novastore.com', 'NovaStore Flagship'),
        ('00000000-0000-4000-8000-000000000002', 'AeroFit Wireless ANC Headphones', 'Active Noise Cancellation, 40-hour ultra battery endurance, and hi-res lossless spatial audio.', 1250000.00, 20, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', 'Audio', 'official@novastore.com', 'NovaStore Flagship'),
        ('00000000-0000-4000-8000-000000000003', 'Vanguard Smart GPS Fitness Watch', '1.43" AMOLED Retina display, dual-band GPS, 24/7 heart-rate monitoring, and 5ATM water resistance.', 850000.00, 45, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', 'Wearables', 'official@novastore.com', 'NovaStore Flagship'),
        ('00000000-0000-4000-8000-000000000004', 'NovaCraft Leather Executive Backpack', 'Handcrafted genuine leather and waterproof ballistic canvas tailored for up to 16-inch laptops.', 650000.00, 15, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 'Accessories', 'official@novastore.com', 'NovaStore Flagship'),
        ('00000000-0000-4000-8000-000000000005', 'Starlight Wireless Precision Mouse', 'Ultra-lightweight 58g frame, 26,000 DPI optical sensor, and zero-latency wireless connectivity.', 495000.00, 50, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', 'Peripherals', 'official@novastore.com', 'NovaStore Flagship'),
        ('00000000-0000-4000-8000-000000000006', 'HydroShield Vacuum Insulated Tumbler 750ml', 'Triple-insulated stainless steel keeps cold for 24 hours and hot for 12 hours. BPA-free leakproof lid.', 195000.00, 60, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 'Lifestyle', 'official@novastore.com', 'NovaStore Flagship');

    INSERT INTO public.orders (id, customer_name, customer_email, customer_phone, customer_address, total_amount, admin_fee, shipping_courier, shipping_cost, destination_lat, destination_lng, payment_method, payment_verified, status, seller_email, created_at)
    VALUES
        ('10000000-0000-4000-8000-000000000001', 'Budi Pratama', 'budi.pratama@example.com', '081298765432', 'Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said, Jakarta Selatan 12950', 1896250.00, 46250.00, 'JNE Express - Reguler (REG)', 15000.00, -6.2255000, 106.8318000, 'qris', true, 'completed', 'official@novastore.com', NOW() - INTERVAL '3 hours'),
        ('10000000-0000-4000-8000-000000000002', 'Siti Rahmadani', 'siti.rahma@example.com', '085712345678', 'Jl. Ir. H. Juanda No. 120, Dago, Bandung, Jawa Barat 40132', 1301250.00, 31250.00, 'J&T Express - EZ Standard', 20000.00, -6.8850000, 107.6140000, 'bank_transfer', true, 'processing', 'official@novastore.com', NOW() - INTERVAL '1 hour'),
        ('10000000-0000-4000-8000-000000000003', 'Andi Wijaya', 'andi.wijaya@example.com', '081377889900', 'Jl. Pemuda No. 45, Embong Kaliasin, Surabaya, Jawa Timur 60271', 886250.00, 21250.00, 'Shopee Xpress (SPX) - Standard Eco', 15000.00, -7.2650000, 112.7480000, 'qris', true, 'completed', 'official@novastore.com', NOW() - INTERVAL '30 minutes');

    INSERT INTO public.order_items (id, order_id, product_id, quantity, unit_price, subtotal)
    VALUES
        ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 1, 1850000.00, 1850000.00),
        ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', 1, 1250000.00, 1250000.00),
        ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000003', 1, 850000.00, 850000.00);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
