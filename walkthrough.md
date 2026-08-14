# Walkthrough: Advanced Logistics, 2.5% Admin Fee, and Multi-Payment Architecture

We have implemented the new features requested:
1. **2.5% Administrative Fee (Biaya Layanan)** calculated dynamically and displayed across the entire order lifecycle.
2. **Interactive Map Location Pinning & Multi-Courier Shipping Engine** (JNE, J&T, SPX, SiCepat, Instant) with real-time distance-based tariff estimation.
3. **0% Fee Direct QRIS & Bank Transfer Payment Proof Upload & Verification System**.

---

## 🚀 What Changed & Tested

### 1. 2.5% Administrative Fee Calculation
- Implemented `admin_fee = Math.round(cartTotal * 0.025)`.
- Calculated and itemized in:
  - **Checkout Form & Summary Sidebar**
  - **Order Confirmation Receipt (`/order-success/[id]`)**
  - **Official Corporate Tax Invoice (`/invoice/[id]`)**
  - **Admin Real-time Dashboard (`/admin/dashboard`)**

### 2. Interactive Map Geolocation & Multi-Courier Logistics
- **[New Component] `src/components/MapLocationPicker.tsx`**:
  - OpenStreetMap & Leaflet-powered coordinate visualizer.
  - One-click **"Use My Current GPS"** button via HTML5 Geolocation API.
  - Real-time Haversine distance calculator measuring distance from NovaStore Jakarta Central Hub.
- **Integrated Courier Options**:
  - **JNE Express (Reguler)**: Rp 10.000 base + Rp 300/km (ETA 2-3 Days)
  - **J&T Express (EZ Standard)**: Rp 11.000 base + Rp 320/km (ETA 1-2 Days)
  - **Shopee Xpress (SPX Eco)**: Rp 9.000 base + Rp 280/km (ETA 2-4 Days)
  - **SiCepat (BEST Express)**: Rp 12.000 base + Rp 350/km (ETA 1-2 Days)
  - **Instant Courier (GoSend/GrabExpress)**: Rp 18.000 base + Rp 1.200/km (ETA 2-4 Hours)

### 3. Payment Methods: Direct QRIS & Bank Transfer Proof
- **Instant QRIS (0% Transaction Fee)**:
  - Customers scan directly with BCA Mobile, Livin, GoPay, OVO, Dana, ShopeePay.
  - Zero intermediary deductions (0% MDR direct-to-seller).
- **Bank Transfer + Proof Upload**:
  - Displays destination bank accounts (BCA, Mandiri).
  - Customers upload payment receipt image screenshots with live preview.
- **Cash on Delivery (COD)**:
  - Available alternative payment method.
- **Admin Verification Center**:
  - Live orders table displays courier badge & `[📎 Receipt Attached]` badge.
  - Clicking on an order opens the inspection modal with the receipt preview.
  - 1-click **"Approve Payment"** (moves order to `processing`) or **"Reject"** (`cancelled`).
  - Full-resolution receipt lightbox modal.
  - **"QRIS & Bank Setup"** modal for each seller to configure their payout accounts.

---

## 🧪 Build & Verification
- `npm run build`: Compiled with 0 TypeScript/Lint errors.
