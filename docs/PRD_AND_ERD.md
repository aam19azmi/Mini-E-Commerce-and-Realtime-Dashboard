# Product Requirement Document (PRD) & Entity Relationship Diagram (ERD)

## 1. Executive Summary & Product Overview
**Project Title:** NovaStore Mini E-Commerce & Real-time Operations Dashboard  
**Business Domain:** Digital Retail, Consumer Electronics & Lifestyle Flagship Store  
**Mission:** Deliver a frictionless, ultra-fast guest shopping experience paired with an enterprise-grade, real-time administrative command center for live order tracking, financial reconciliation, and logistics dispatch.

---

## 2. Target Personas & Core User Flows
1. **Public Customer (Guest Shopper):**
   - No registration or login barrier.
   - Browse catalog with live search and category filters.
   - Multi-product shopping cart with dynamic quantity adjustments.
   - Pinpoint GPS delivery location on an interactive map.
   - Dynamic multi-courier shipping selection (JNE, J&T, SPX, SiCepat, Instant).
   - Real-time 2.5% administrative service fee calculation.
   - Zero-fee Instant QRIS, Bank Transfer with receipt screenshot upload, or Cash on Delivery (COD).
   - Instant order confirmation and scannable corporate tax invoice.

2. **Store Operations Officer & Financial Administrator:**
   - Secure authentication via Supabase Auth or 1-click Demo Admin access.
   - Real-time live orders monitor powered by Supabase PostgreSQL WebSockets.
   - Interactive financial analytics charts (Revenue trends, Order status distribution, AOV).
   - Payment proof inspection center with full-resolution zoom lightbox and 1-click Approve / Reject.
   - Full product catalog inventory CRUD (Create, Read, Update, Delete with modern confirmation modal).
   - 1-click CSV / Excel export for accounting reports.
   - Live order simulation tool for instant real-time demonstration.

---

## 3. Financial & Logistics Engine

### 3.1 Fee & Tax Computation Formula
$$\text{Product Subtotal} = \sum (\text{Price} \times \text{Quantity})$$
$$\text{Shipping Tariff} = \text{Base Cost} + (\text{Distance in KM} \times \text{Tariff per KM})$$
$$\text{Admin Fee (Biaya Layanan 2.5\%)} = \text{Round}(\text{Product Subtotal} \times 0.025)$$
$$\text{Grand Total} = \text{Product Subtotal} + \text{Shipping Tariff} + \text{Admin Fee}$$

$$\text{DPP (Dasar Pengenaan Pajak)} = \text{Round}\left(\frac{\text{Product Subtotal}}{1.11}\right)$$
$$\text{PPN 11\%} = \text{Product Subtotal} - \text{DPP}$$

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
        varchar shipping_courier "JNE, J&T, SPX, SiCepat, Instant"
        numeric shipping_cost "Calculated logistics cost"
        numeric destination_lat "GPS Latitude"
        numeric destination_lng "GPS Longitude"
        text payment_proof_url "Base64 / Receipt URL"
        boolean payment_verified "True if approved"
        varchar status "pending | processing | completed | cancelled"
        varchar payment_method "qris | bank_transfer | cash_on_delivery"
        timestamp created_at "Order placement time"
    }

    ORDER_ITEMS {
        uuid id PK "gen_random_uuid()"
        uuid order_id FK "References ORDERS(id)"
        uuid product_id FK "References PRODUCTS(id)"
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
- **`public.products`**: Read access granted to `public`; mutations granted to authenticated admins.
- **`public.orders`**: `INSERT` open for public guest checkout; `SELECT` and `UPDATE` granted for store administration and real-time WebSocket publications.
- **`public.order_items`**: `INSERT` open for public checkout items; `SELECT` enabled for verified invoices and dashboard order detail inspections.
