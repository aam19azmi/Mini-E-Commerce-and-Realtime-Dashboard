-- ==========================================================
-- NovaStore: Database Complete Reset & Default Seeder
-- Copy and run this script in your Supabase SQL Editor
-- to clear all test records and restore pristine default data.
-- ==========================================================

-- 1. Ensure UUID extension is active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clear all previous orders and products (Clean Slate)
TRUNCATE TABLE public.order_items, public.orders, public.products CASCADE;

-- 3. Insert Pristine Default Flagship Product Catalog
INSERT INTO public.products (name, description, price, stock, image_url, category)
VALUES
    (
        'Apex Pro RGB Mechanical Keyboard', 
        'Aircraft-grade aluminum frame, OmniPoint adjustable switches, and per-key RGB illumination with USB passthrough.', 
        1850000.00, 
        35, 
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', 
        'Electronics'
    ),
    (
        'AeroFit Wireless ANC Headphones', 
        'Active Noise Cancellation, 40-hour ultra battery endurance, and hi-res lossless spatial audio.', 
        1250000.00, 
        20, 
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', 
        'Audio'
    ),
    (
        'Vanguard Smart GPS Fitness Watch', 
        '1.43" AMOLED Retina display, dual-band GPS, 24/7 heart-rate monitoring, and 5ATM water resistance.', 
        850000.00, 
        45, 
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', 
        'Wearables'
    ),
    (
        'NovaCraft Leather Executive Backpack', 
        'Handcrafted genuine leather and waterproof ballistic canvas tailored for up to 16-inch laptops.', 
        650000.00, 
        15, 
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 
        'Accessories'
    ),
    (
        'Starlight Wireless Precision Mouse', 
        'Ultra-lightweight 58g frame, 26,000 DPI optical sensor, and zero-latency wireless connectivity.', 
        495000.00, 
        50, 
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', 
        'Peripherals'
    ),
    (
        'HydroShield Vacuum Insulated Tumbler 750ml', 
        'Triple-insulated stainless steel keeps cold for 24 hours and hot for 12 hours. BPA-free leakproof lid.', 
        195000.00, 
        60, 
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 
        'Lifestyle'
    );

-- 4. Insert Default Starter Orders (Demonstration metrics for charts)
INSERT INTO public.orders (
    customer_name, 
    customer_email, 
    customer_phone, 
    customer_address, 
    total_amount, 
    admin_fee, 
    shipping_courier, 
    shipping_cost, 
    destination_lat, 
    destination_lng, 
    payment_method, 
    payment_verified, 
    status, 
    created_at
)
VALUES
    (
        'Budi Pratama',
        'budi.pratama@example.com',
        '081298765432',
        'Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said, Jakarta Selatan 12950',
        1896250.00,
        46250.00,
        'JNE Express - Reguler (REG)',
        15000.00,
        -6.2255000,
        106.8318000,
        'qris',
        true,
        'completed',
        NOW() - INTERVAL '3 hours'
    ),
    (
        'Siti Rahmadani',
        'siti.rahma@example.com',
        '085712345678',
        'Jl. Ir. H. Juanda No. 120, Dago, Bandung, Jawa Barat 40132',
        1301250.00,
        31250.00,
        'J&T Express - EZ Standard',
        20000.00,
        -6.8850000,
        107.6140000,
        'bank_transfer',
        true,
        'processing',
        NOW() - INTERVAL '1 hour'
    ),
    (
        'Andi Wijaya',
        'andi.wijaya@example.com',
        '081377889900',
        'Jl. Pemuda No. 45, Embong Kaliasin, Surabaya, Jawa Timur 60271',
        886250.00,
        21250.00,
        'Shopee Xpress (SPX) - Standard Eco',
        15000.00,
        -7.2650000,
        112.7480000,
        'qris',
        true,
        'completed',
        NOW() - INTERVAL '30 minutes'
    );
