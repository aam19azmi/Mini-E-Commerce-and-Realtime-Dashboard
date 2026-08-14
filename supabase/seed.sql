-- ==========================================================
-- NovaStore Comprehensive Database Seeder (PostgreSQL / Supabase)
-- Run this in your Supabase SQL Editor to populate sample products & orders
-- ==========================================================

-- 1. Clear previous test records (optional clean slate)
-- DELETE FROM public.order_items;
-- DELETE FROM public.orders;
-- DELETE FROM public.products;

-- 2. Insert Diverse Multi-Seller Product Catalog
INSERT INTO public.products (name, description, price, stock, image_url, category, seller_email, seller_name)
VALUES
    (
        'Apex Pro RGB Mechanical Keyboard', 
        'Aircraft-grade aluminum frame, OmniPoint adjustable switches, and per-key RGB illumination.', 
        1850000.00, 
        35, 
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', 
        'Electronics',
        'official@novastore.com',
        'NovaStore Flagship'
    ),
    (
        'AeroFit Wireless ANC Headphones', 
        'Active Noise Cancellation, 40-hour ultra battery endurance, and hi-res lossless wireless audio.', 
        1250000.00, 
        20, 
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', 
        'Audio',
        'official@novastore.com',
        'NovaStore Flagship'
    ),
    (
        'Vanguard Smart GPS Fitness Watch', 
        '1.43" AMOLED Retina display, dual-band GPS, 24/7 heart-rate monitoring, and 5ATM water resistance.', 
        850000.00, 
        45, 
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', 
        'Wearables',
        'seller1@example.com',
        'TechGear Indonesia'
    ),
    (
        'NovaCraft Leather Executive Backpack', 
        'Handcrafted genuine leather and waterproof ballistic canvas tailored for 16-inch laptops.', 
        650000.00, 
        15, 
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 
        'Accessories',
        'seller1@example.com',
        'TechGear Indonesia'
    ),
    (
        'Starlight Wireless Precision Mouse', 
        'Ultra-lightweight 58g honeycomb frame, 26,000 DPI optical sensor, and zero-latency wireless.', 
        495000.00, 
        50, 
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', 
        'Peripherals',
        'seller2@example.com',
        'CyberStore Official'
    ),
    (
        'HydroShield Vacuum Insulated Tumbler 750ml', 
        'Triple-insulated stainless steel keeps cold for 24h and hot for 12h. BPA-free leakproof lid.', 
        195000.00, 
        60, 
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 
        'Lifestyle',
        'seller2@example.com',
        'CyberStore Official'
    ),
    (
        'StudioPulse 4K UHD Pro Webcam', 
        '60 FPS streaming webcam with AI auto-framing, HDR lens, and dual stereo noise-canceling mics.', 
        720000.00, 
        25, 
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80', 
        'Electronics',
        'official@novastore.com',
        'NovaStore Flagship'
    ),
    (
        'ErgoComfort Memory Foam Wrist Rest', 
        'Premium cooling-gel memory foam with non-slip base for mechanical keyboards and desks.', 
        125000.00, 
        80, 
        'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=600&q=80', 
        'Accessories',
        'seller1@example.com',
        'TechGear Indonesia'
    )
ON CONFLICT DO NOTHING;

-- 3. Insert Multi-Seller Sample Orders with Logistics & 2.5% Admin Fee Itemization
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
    seller_email,
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
        'official@novastore.com',
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
        'official@novastore.com',
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
        'seller1@example.com',
        NOW() - INTERVAL '5 hours'
    ),
    (
        'Dewi Lestari',
        'dewi.lestari@example.com',
        '082199887766',
        'Jl. Sunset Road No. 88, Kuta, Denpasar, Bali 80361',
        681250.00,
        16250.00,
        'SiCepat - BEST Express',
        25000.00,
        -8.7040000,
        115.1780000,
        'bank_transfer',
        false,
        'pending',
        'seller1@example.com',
        NOW() - INTERVAL '30 minutes'
    ),
    (
        'Reza Rahadian',
        'reza.r@example.com',
        '081822334455',
        'Jl. Malioboro No. 14, Sosromenduran, Yogyakarta 55271',
        522375.00,
        12375.00,
        'Instant Courier - Same Day Bike',
        30000.00,
        -7.7925000,
        110.3658000,
        'cash_on_delivery',
        false,
        'pending',
        'seller2@example.com',
        NOW() - INTERVAL '10 minutes'
    );
