# Implementation Plan: Advanced Checkout, Courier Logistics & Payment Flow

We are upgrading the **Mini E-Commerce & Real-time Dashboard** with enterprise-grade features:
1. **2.5% Administrative Fee (Biaya Layanan)** calculated across checkout, dashboard, and invoices.
2. **Interactive Map Pin Location & Multi-Courier Shipping Engine (JNE, J&T, SPX, SiCepat, Instant)** with real-time distance-based tariff estimation.
3. **Direct-to-Seller Zero-Fee Static QRIS** & **Bank Transfer Payment Proof Upload & Verification System**.

---

## 🏛️ Architectural Assessment & Appraisal

### 1. 2.5% Administrative Fee
- **Calculation Formula**: `Admin Fee = Math.round(Order Subtotal * 0.025)`.
- **Financial Flow**:
  - `Item Subtotal (DPP + PPN)`: Sum of items.
  - `Shipping Cost`: Selected courier tariff (JNE / J&T / SPX).
  - `Admin Service Fee (2.5%)`: 2.5% of Subtotal.
  - `Grand Total`: `Subtotal + Shipping Cost + Admin Fee`.
- **Display Locations**: Real-time breakdown in Cart Drawer, Checkout Summary, Order Receipt, Official Tax Invoice, and Admin Dashboard.

### 2. Multi-Courier Shipping & Map Geolocation Engine
- **Map Pinpoint Selector**: Lightweight, interactive **OpenStreetMap / Leaflet** coordinate picker with auto-locate ("Pin My Current GPS Location") and address reverse-geocoding (Nominatim API).
- **Courier Logistics Matrix**:
  - **JNE Express** (Reguler, YES / Next Day)
  - **J&T Express** (EZ Standard, Super Express)
  - **Shopee Xpress / SPX** (Standard Eco)
  - **SiCepat** (BEST, H3LO)
  - **Instant Courier** (GoSend / GrabExpress Bike)
- **Tariff Logic**: Dynamic calculation based on delivery distance ($km$) and parcel weight ($kg$), providing accurate Indonesian shipping rates.

### 3. Payment Methods (Zero-Fee QRIS & Bank Transfer Proof)
- **Instant Direct QRIS (0% Fee Strategy)**:
  - Sellers configure their Merchant QRIS image / Dana / GoPay / BCA QRIS in Seller Settings.
  - At checkout, customer scans the seller's QRIS directly — funds transfer instantly with **0% middleman deduction**.
- **Manual Bank Transfer + Receipt Proof Upload**:
  - Customer transfers to the seller/store bank account (BCA, Mandiri, BRI, BNI).
  - Customer uploads payment proof (receipt photo/screenshot) via Supabase Storage / base64 image stream.
  - Admin/Seller inspects payment proof in the dashboard and clicks **"Verify & Approve Payment"** with instant real-time status update.
- **Cash on Delivery (COD)**:
  - Frictionless cash settlement upon courier arrival.

---

## 🗄️ Database & Schema Extensions

We will extend `orders`, `products`, and seller profile configurations:

```sql
-- Extended schema for Courier, Fees, and Payment Proof
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS admin_fee NUMERIC(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_courier VARCHAR(100) DEFAULT 'JNE Reguler',
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS destination_lat NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS destination_lng NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS seller_qris_url TEXT,
ADD COLUMN IF NOT EXISTS seller_bank_info TEXT;
```

---

## 📋 Proposed Implementation Breakdown

### Component 1: Checkout Form & Interactive Map Location Picker
- **[NEW] `src/components/MapLocationPicker.tsx`**:
  - Interactive map allowing drag-and-drop location pinning.
  - "Use My Current GPS Location" button via Browser Geolocation API.
  - Calculates driving distance from Store Warehouse (Jakarta Hub) to customer pin.
- **[MODIFY] `src/app/checkout/page.tsx`**:
  - Integrate MapLocationPicker.
  - Courier selector radio group (JNE, J&T, SPX, SiCepat, Instant) with real-time delivery estimates and pricing.
  - Auto-calculate 2.5% administrative fee.
  - Multi-payment workflow:
    - **QRIS Tab**: Displays seller QR code + download QR action.
    - **Bank Transfer Tab**: Displays bank account details + drag-and-drop receipt image uploader.
    - **COD Tab**: Cash on delivery notice.

### Component 2: Official Invoice & Receipt Upgrade
- **[MODIFY] `src/app/invoice/[id]/page.tsx`**:
  - Add **Administrative Fee (2.5%)** line item.
  - Add **Courier & Tracking Service** details (e.g. `JNE Express - REG • 2-3 Days Delivery`).
  - Add Customer GPS Coordinate coordinates / Delivery Pin summary.
  - Add Payment Proof attachment status badge.
- **[MODIFY] `src/app/order-success/[id]/page.tsx`**:
  - Display updated breakdown with courier tracking info and payment status.

### Component 3: Admin Dashboard Logistics & Payment Proof Verification
- **[MODIFY] `src/app/admin/dashboard/page.tsx`**:
  - **Payment Verification Center**:
    - For Bank Transfer orders, shows a **"View Payment Proof"** preview modal.
    - 1-click **"Approve & Mark Paid"** or **"Reject Payment"**.
  - **Logistics & Courier Column**:
    - Shows selected courier badge (JNE, J&T, SPX) and map coordinates.
  - **Seller QRIS & Bank Settings Modal**:
    - Allows each seller to configure their own Bank Account (BCA/Mandiri/BRI) and QRIS image URL.

---

## 🔍 Verification Plan

### Manual Verification Flow:
1. **Storefront & Cart**: Add products and proceed to `/checkout`.
2. **Interactive Map Pinning**: Click "Locate Me" or click anywhere on the map to pin a delivery address.
3. **Courier Selection**: Choose between JNE, J&T, SPX, SiCepat, or Instant Courier. Verify that shipping cost updates immediately.
4. **Fee Verification**: Verify that the 2.5% Admin Fee is calculated correctly ($Subtotal \times 0.025$).
5. **QRIS & Bank Transfer Proof**:
   - Select **Instant QRIS**: Check seller QR display.
   - Select **Bank Transfer**: Upload a sample receipt screenshot and submit order.
6. **Admin Dashboard Verification**:
   - Open `/admin/dashboard`.
   - Inspect the incoming order with the attached payment receipt proof image.
   - Click "Approve Payment" and observe real-time status update to `completed` / `processing`.
7. **Invoice Generation**:
   - Click "View & Print Official Tax Invoice" and verify that Subtotal, 2.5% Admin Fee, Courier Shipping, and Grand Total match to the exact Rupiah.
