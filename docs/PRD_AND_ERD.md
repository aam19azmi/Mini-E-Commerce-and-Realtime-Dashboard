# Product Requirement Document (PRD) & Entity Relationship Diagram (ERD)

## 1. Executive Summary & Product Overview
**Project Title:** NovaStore Mini E-Commerce & Real-time Operations Dashboard  
**Business Domain:** Digital Retail, Consumer Electronics & Lifestyle Flagship Store  
**Mission:** Deliver a frictionless, ultra-fast guest shopping experience paired with an enterprise-grade, real-time administrative command center for live order tracking, financial reconciliation, and logistics dispatch.

---

## 2. Target Personas & Core User Flows
1. **Public Customer (Guest Shopper):**
   - No registration or login barrier.
   - Browse catalog with live search, category filters, and real-time stock indicators.
   - Multi-product shopping cart with dynamic quantity adjustments and automatic stock limit capping.
   - Pinpoint GPS delivery location on an interactive Leaflet map.
   - Dynamic multi-courier shipping selection (JNE, J&T, SPX, SiCepat, Instant Bike, DHL, FedEx, UPS).
   - Real-time 2.5% administrative service fee calculation.
   - Zero-fee Instant QRIS, Bank Transfer with receipt screenshot upload, or Cash on Delivery (COD).
   - Instant order confirmation and scannable corporate tax invoice with digital verification QR codes.

2. **Store Operations Officer & Financial Administrator:**
   - Secure authentication via Supabase Auth or 1-click Demo Admin access with **Zero-Flash Security Guard** (prevents unauthenticated UI rendering).
   - Real-time live orders and inventory monitor powered by Supabase PostgreSQL WebSockets.
   - Interactive financial analytics charts (Revenue trends, Order status distribution, AOV).
   - Payment proof inspection center with full-resolution zoom lightbox and 1-click Approve / Reject.
   - **Date & Time Order Filtering & Sorting**: Multi-dimensional transaction filter supporting quick presets (Today, Yesterday, Last 24 Hours, Last 7 Days, Last 30 Days, This Month, All Time), custom datetime range picker (`datetime-local`), and 1-click ascending/descending timestamp sorting.
   - **Itemized Order Inspection**: Deep relational inspection displaying purchased product thumbnails, SKU numbers, item names, categories, quantities, unit prices, and subtotals within the Order Details Modal.
   - Automated inventory stock management (dual-layer automatic decrement on purchase, automatic restitution on cancellation/customer returns).
   - Standardized Return Merchandise Authorization (RMA) SOP (Customer returns item to hub &rarr; Physical inspection &rarr; Status `Cancelled` &rarr; 100% refund).
   - Full product catalog inventory CRUD (Create, Read, Update, Delete with modern confirmation modal and foreign key constraint protection).
   - Official Printable Tax Invoices (`/invoice/[id]`) with dynamic itemized product tables, digital verification QR codes, and cashier officer attribution.
   - Storefront Corporate Footer with official Jakarta headquarters, customer care contacts, and logistics/payment partner badges.
   - 1-click CSV / Excel export for accounting reports (automatically scoped to active Date & Time and Status filters).
   - Live order simulation tool for instant real-time demonstration.
   - 1-click Database Reset modal with Clear Test Orders (0 Orders) and Full Pristine Restore modes.

---

## 3. Financial & Logistics Engine

### 3.1 Fee & Tax Computation Formula
$$\text{Product Subtotal} = \sum (\text{Price} \times \text{Quantity})$$
$$\text{Shipping Tariff} = \text{Base Cost} + (\text{Distance in KM} \times \text{Tariff per KM})$$
$$\text{Admin Fee (Biaya Layanan 2.5\%)} = \text{Round}(\text{Product Subtotal} \times 0.025)$$
$$\text{Grand Total} = \text{Product Subtotal} + \text{Shipping Tariff} + \text{Admin Fee}$$

$$\text{DPP (Dasar Pengenaan Pajak)} = \text{Round}\left(\frac{\text{Product Subtotal}}{1.11}\right)$$
$$\text{PPN 11\% (Domestic)} = \text{Product Subtotal} - \text{DPP}$$
$$\text{PPN Ekspor (International)} = \text{Rp 0 (0\% Zero-Rated Export Tax Incentive)}$$
$$\text{Bea Keluar (Export Tariff ID)} = \text{Rp 0 (0\% Free Export Duty - Ditjen Bea Cukai)}$$
$$\text{Destination Customs (Bea Cukai Impor)} = \text{DDU (Delivered Duty Unpaid / De Minimis Threshold)}$$

### 3.2 Intelligent 4-Tier Logistics Classification Matrix
1. **Tier 1: Local Intra-City (< 35 km):** 🛵 Instant Same-Day Motorbike (GoSend/Grab) + Domestic Couriers.
2. **Tier 2: Regional Overland (35 – 750 km):** 🚚 Ground Fleet Vans & Cargo Trucks (JNE REG, J&T EZ, SPX Eco, SiCepat BEST).
3. **Tier 3: Inter-Island Nationwide (750 – 3.800 km):** ✈️ Commercial Air Cargo Planes & Maritime RORO Ships.
4. **Tier 4: International Cross-Border (> 3.800 km):** 🌐 Global Air Freight Carriers (**DHL Express, FedEx International, Pos Indonesia EMS, UPS Worldwide**).

---

## 4. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    PRODUCTS {
        uuid id PK "gen_random_uuid()"
        varchar name "Product Name"
        text description "Detailed description"
        numeric price "Unit Price in IDR"
        integer stock "Available inventory count"
        text image_url "High-res Unsplash image"
        varchar category "Electronics, Audio, Wearables, etc."
        varchar seller_email "Seller account email"
        varchar seller_name "Seller store name"
        timestamp created_at "Timestamp"
    }

    ORDERS {
        uuid id PK "gen_random_uuid()"
        varchar customer_name "Buyer full name"
        varchar customer_email "Buyer email address"
        varchar customer_phone "Phone / WhatsApp"
        text customer_address "Full destination address"
        numeric total_amount "Grand Total Amount (IDR)"
        numeric admin_fee "2.5% Platform Service Fee"
        varchar shipping_courier "JNE, J&T, SPX, SiCepat, Instant, DHL"
        numeric shipping_cost "Calculated logistics cost"
        numeric destination_lat "GPS Latitude"
        numeric destination_lng "GPS Longitude"
        text payment_proof_url "Base64 / Receipt URL"
        boolean payment_verified "True if approved"
        varchar status "pending | processing | completed | cancelled"
        varchar payment_method "qris | bank_transfer | cash_on_delivery"
        varchar seller_email "Seller account email"
        timestamp created_at "Order placement time"
    }

    ORDER_ITEMS {
        uuid id PK "gen_random_uuid()"
        uuid order_id FK "References ORDERS(id) ON DELETE CASCADE"
        uuid product_id FK "References PRODUCTS(id) ON DELETE RESTRICT"
        integer quantity "Quantity purchased"
        numeric unit_price "Price at purchase time"
        numeric subtotal "quantity * unit_price"
        timestamp created_at "Timestamp"
    }

    PRODUCTS ||--o{ ORDER_ITEMS : "ordered in"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
```

---

## 5. Security & Row Level Security (RLS) Policies
- **`public.products`**: Read access granted to `public`; mutations and atomic RPCs (`deduct_product_stock`) available with security definer execution.
- **`public.orders`**: `INSERT` open for public guest checkout; `SELECT` and `UPDATE` granted for store administration and real-time WebSocket publications.
- **`public.order_items`**: `INSERT` open for public checkout items; `SELECT` enabled for verified invoices and dashboard order detail inspections.

---

## 6. Dual-Layer State Parity & Inventory Synchronization Architecture
1. **Single Source of Truth Catalog**: Deterministic standard UUIDs (`00000000-0000-4000-8000-000000000001` to `...0006`) ensure consistent identity across SQL seeders, live cloud queries, and client-side fallback state.
2. **Dual-Layer Inventory Engine (`stockManager.ts`)**:
   - **Cloud Update**: Executes atomic PostgREST update or RPC `deduct_product_stock`.
   - **Local Cache Override**: Writes updated stock to `localStorage` (`novastore_stock_overrides`).
   - **Real-time Event Broadcast**: Emits `novastore:stock_updated` window event and pushes to Supabase Realtime channel for instant multi-tab UI synchronization.
3. **Cascade Deletion Protocol**:
   - Resets execute in strict relational dependency order: `order_items` $\rightarrow$ `orders` $\rightarrow$ `products`.
   - Clears test data flags and restores pristine products & starter demo orders without foreign key constraint violations.
