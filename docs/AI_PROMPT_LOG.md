# AI Prompt & Engineering Development Log

This document serves as the official AI Prompting Log for the **NovaStore Mini E-Commerce and Realtime Dashboard** technical test submission, detailing all user prompts, design decisions, architectural iterations, and agent actions.

---

## 📅 Session 1: Project Initiation, Rules Definition & Architectural Planning
- **Date:** August 14, 2026
- **User Prompt:** Provided technical test instructions & specifications (Guest Checkout, Multi-Product support, Real-time Admin Dashboard, Next.js + Supabase + Vercel deployment, English documentation requirement, Free tier constraints).
- **Key Engineering Actions:**
  1. Formulated `.agents/rules/AGENTS.md` specifying architecture constraints, Supabase free-tier limits, token minimization strategies, and strict modal guidelines (ban on `window.confirm()`).
  2. Created `implementation_plan.md` featuring preliminary PRD, ERD, and flowcharts.
  3. Structured the project directory and verified tooling prerequisites.

---

## 📅 Session 2: Database Schema & Initial Documentation Scaffolding
- **User Prompt:** "Okay thanks then I'll create subdomain for the last. We are ready to start"
- **Key Engineering Actions:**
  1. Bootstrapped Next.js App Router with TypeScript and Tailwind CSS.
  2. Generated `supabase/schema.sql` encompassing:
     - `products`, `orders`, and `order_items` tables.
     - Row Level Security (RLS) policies for guest buyers and authenticated admins.
     - Real-time PostgreSQL publication (`supabase_realtime`).
     - Realistic seed product dataset in Indonesian Rupiah (IDR).
  3. Created initial `docs/PRD_AND_ERD.md` and `docs/SYSTEM_FLOWCHART.md`.

---

## 📅 Session 3: Core Full-Stack Application Implementation
- **Key Engineering Actions:**
  1. Configured Supabase client in `src/lib/supabase.ts`.
  2. Built `CartContext.tsx` with persistent multi-product cart state.
  3. Built Storefront (`src/app/page.tsx`) with product filtering and responsive cards.
  4. Built Guest Checkout (`src/app/checkout/page.tsx`) with multi-product order creation.
  5. Built Order Confirmation (`src/app/order-success/[id]/page.tsx`) with confetti celebrations.
  6. Built Admin Login (`src/app/admin/login/page.tsx`) with Supabase Auth and Instant Demo Access.
  7. Built Real-time Admin Dashboard (`src/app/admin/dashboard/page.tsx`) with Supabase WebSocket subscriptions, KPI cards, visual Recharts (Area and Pie), live orders table, and instant status updater.

---

## 📅 Session 4: Verification, RLS Optimization & Database Sync
- **Key Engineering Actions:**
  1. Captured and archived UI screenshots in `docs/screenshots/` and documented in `docs/SCREENSHOTS.md`.
  2. Resolved RLS `SELECT` policy constraints for the `orders` table to allow persistent reads across page refreshes.
  3. Executed full idempotent database migration in Supabase SQL editor.
  4. Verified full end-to-end flow: Guest checkout order creation -> WebSocket real-time broadcast -> Permanent database persistence.

---

## 📅 Session 5: Modern UI/UX Dialogs & Commercial Tax Invoice Engine
- **User Prompt:** Requested replacement of native browser `confirm()` dialogs with custom UI, and fixing invoice rendering to a dedicated, professional tax invoice document.
- **Key Engineering Actions:**
  1. Replaced all `window.confirm()` calls with a custom glassmorphism modal with warning indicators and confirmation buttons.
  2. Created dedicated `/invoice/[id]` route with corporate styling (`PT NOVA DIGITAL NIAGA INDONESIA`), DPP + PPN 11% tax calculation, scannable QR verification code, and print-optimized CSS.
  3. Added 1-click CSV export and full product catalog CRUD.

---

## 📅 Session 6: Advanced Logistics, Map Pinpoint & 2.5% Admin Fee Engine
- **User Prompt:** "1. Administrative Fee: Please add an administrative fee of 2,5% from buyer payed that is automatically calculated and displayed on the invoice. 2. Integrated shipping cost calculation: we need to integrate shipment services (such as JNT, JNE, SPX, etc) to automatically calculate shipping cost. Both sellers and customers should be able to either type their address or pin their exact location on a map. Payment method: instant qris: zero transaction fees, bank transfer manual proof verification, COD."
- **Key Engineering Actions:**
  1. Built `src/components/MapLocationPicker.tsx` with OpenStreetMap, Leaflet visualizer, GPS auto-detect, and Haversine distance calculator.
  2. Implemented multi-courier tariff calculation matrix (JNE, J&T, SPX, SiCepat, Instant).
  3. Added automatic 2.5% administrative service fee calculation (`Math.round(cartTotal * 0.025)`).
  4. Built payment receipt screenshot uploader with base64 conversion and full-resolution lightbox viewer in the Admin Dashboard.
  5. Added payment verification actions (`Approve Payment` / `Reject`) in the Admin Dashboard.

---

## 📅 Session 7: Cash Flow Architecture Consultation & Cross-Browser Polish
- **User Prompt:** "So how does the 2.5% administrative fee get deposited into my bank account or e wallet? Which model is free? ... Also improve this application for UI/UX like can display perfect at chrome, microsoft edge, and other browsers. And make seeder for this application."
- **Key Engineering Actions:**
  1. Consulted on the 3 industry-standard cash flow models (Direct-to-Seller Billing, Escrow Gateway, and Deposit Deduction).
  2. Enhanced `src/app/globals.css` with sleek dark scrollbars, backdrop-blur webkit fallbacks, and text antialiasing for Chrome, Edge, Safari, and Firefox.
  3. Created comprehensive PostgreSQL seeder `supabase/seed.sql`.
  4. Added interactive 1-click "Seed Demo Data" action in the Admin Dashboard.

---

## 📅 Session 8: Single-Merchant Architecture Finalization & Submission Package Preparation
- **User Prompt:** "Okay then, let's dismantle it and set it up as a single merchant. ... Why is there still a seller registration option? Can you delete all data and repeat again to default? Prepare submission package and update README.md."
- **Key Engineering Actions:**
  1. Streamlined the Admin Dashboard into a pure, unified **NovaStore Central Operations Command Center**.
  2. Removed seller registration tabs from `src/app/admin/login/page.tsx` for a clean Admin Portal experience with instant demo access.
  3. Added QRIS screenshot proof upload in `src/app/checkout/page.tsx` for consistent manual verification.
  4. Created `supabase/reset_database.sql` to truncate and restore the database to clean default state.
  5. Updated `README.md`, `docs/PRD_AND_ERD.md`, `docs/SYSTEM_FLOWCHART.md`, and `docs/DOCUMENTATION.tex`.
  6. Verified zero build or TypeScript errors with `npm run build`.

---

## 📅 Session 9: Interactive Leaflet Map, Global Geocoding, Multi-Tier Couriers & Customs (Bea Cukai) Engine
- **User Prompt:** "Can I pin my location myself? What is different between simulate order and seed demo data? Are shipping services always can service to delivery to other country? In order summary when customer checkout we forget to add show nominal Tax (11%)... How to determine approach based on customer location (cargo, ship, plane, international agent)? Why search position failed / refreshed page? Why GPS pin differed? Should delivery agents change for international?"
- **Key Engineering Actions:**
  1. Integrated real interactive **Leaflet Map** with direct click-to-pin, draggable markers, and automatic reverse-geocoding.
  2. Built high-accuracy **Indonesian Locations Index** (Jakarta, Bandung, Dago, Surabaya, Bali, Medan, Makassar, IKN, etc.) + **Global World Cities** (New York, Delhi, Shanghai, Tokyo, London, Sydney).
  3. Fixed nested form bug in `MapLocationPicker.tsx` to prevent accidental page refreshes on search input.
  4. Implemented dynamic **4-Tier Logistics Classifier** (Local Motorbike &lt; 35km, Overland Express 35-750km, Inter-Island Air/Sea 750-3800km, International Air Freight &gt; 3800km).
  5. Added dynamic courier fleet switching: Domestic (JNE, J&T, SPX, SiCepat, Instant Bike) vs. International (DHL Express, FedEx, Pos Indonesia EMS, UPS Worldwide).
  6. Added Indonesian **Bea Cukai & Tax Law compliance** (0% Export Duty, 0% VAT Export Zero-Rated, Destination DDU customs notice, PPN 11% itemization) across checkout summary and official invoices.

---

## 📅 Session 10: Inventory Stock Automation, Cancellation Restitution, 1-Click Reset & Strict Agent Rules
- **User Prompt:** "How to manage the store catalog, because when I ordered keyboard for example. Stock for that keyboard hasn't decreased. And when I change status I can see receipt attached. Before I change status I still can see it. And if status change cancelled is stock comeback to before or still decreased? And in store catalog there are two button for Add product. Should we use both or one and delete other? And if I want to reset all data like delete all data except account admin@novastore.com with password admin12345 what should I do? Now on AGENTS.md add rule that every want to work or do something must to create or renew implementation_plan.md and result always create or renew walkthrough.md and always renew all inside on docs directory."
- **Key Engineering Actions:**
  1. Automated **Inventory Stock Decrement** in `src/app/checkout/page.tsx` on order placement (`stock = max(0, stock - quantity)`).
  2. Implemented **Automatic Stock Restitution** in `src/app/admin/dashboard/page.tsx` upon order cancellation (`stock = stock + quantity`) and re-deduction on reactivation.
  3. Removed duplicate "Add Product" button in top navbar, standardizing on the primary catalog header button.
  4. Built **1-Click Database Reset Modal** in Admin Dashboard offering two modes (Clear Test Orders vs. Full Pristine Restore) with guaranteed isolation of `admin@novastore.com`.
  5. Updated `.agents/rules/AGENTS.md` with strict mandatory protocol requiring `implementation_plan.md`, `walkthrough.md`, and complete synchronization across the `docs/` directory.

---

## 📅 Session 12: Resilient Dual-Layer Stock Decrement, Cascade-Safe Reset & Multi-Disciplinary Cognitive Matrix
- **User Prompt:** "I just tested the data reset feature which clearly isn't working properly and found that after a successful order, the stock level didn't decrease, even though I had previously requested a fix for this issue. Do the `agents.md` rules need improvement, or is sub-agent assistance required to build a solid professional team covering marketing, legal, accounting, IT, CTO, CEO, sales, and other sub-agents, including an audit function?"
- **Root-Cause Architectural Analysis:**
  1. *Stock Level Desync*: Storefront fallback catalog used static mock UUIDs (`f1e7a1b0-...`) that differed from database product IDs, causing zero-row updates on checkout. Furthermore, neither Storefront nor Dashboard subscribed to the `products` real-time channel.
  2. *Reset Foreign Key Restrict Error*: `order_items` referenced `products` with `ON DELETE RESTRICT`. PostgREST queries with `.delete().gte('created_at', ...)` inside empty `catch (e) {}` blocks failed silently without deleting children first, causing foreign key violations and duplicate insertions.
- **Key Engineering Actions:**
  1. Created **`src/lib/defaultCatalog.ts`**: Single source of truth with deterministic standard UUIDs (`00000000-0000-4000-8000-000000000001` through `...0006`) matching across SQL seeders, live Supabase queries, and offline fallback constants.
  2. Created **`src/lib/stockManager.ts`**: Dual-layer state engine providing `deductStock()`, `restoreStock()`, `clearAllOrders()`, `resetDatabaseToPristine()`, and `subscribeToStockUpdates()` with instant window broadcast events (`novastore:stock_updated`) and `localStorage` overrides.
  3. Upgraded **`src/app/page.tsx` & `src/app/checkout/page.tsx`**: Integrated real-time `products` table subscriptions and automatic dual-layer stock deductions on order submission.
  4. Upgraded **`src/app/admin/dashboard/page.tsx`**: Added bi-directional real-time listeners for both `orders` and `products` tables, and integrated verified cascade reset routines.
  5. Updated **`supabase/reset_database.sql` & `supabase/schema.sql`**: Added atomic stored procedures (`deduct_product_stock`, `reset_to_pristine_catalog`).
  6. Upgraded **`.agents/rules/AGENTS.md`**: Formalized the **Integrated Multi-Disciplinary Cognitive Matrix** (CTO/IT, Accounting/Flowcash, and Autonomous QA & Audit Gatekeeper) and established the **Pre-Delivery Verification Checklist**.
  7. Validated production build with `npm run build` — 100% compiled with 0 errors.

---

## 📅 Session 13: PostgreSQL RLS Policy Resolution, Pinterest Image Handling, & Itemized Product Breakdown
- **User Prompts:**
  1. *"Minta URL ... POST ... 401 Unauthorized ... Error kenapa? code: 42501 message: new row violates row-level security policy for table products. Why does this error when I want to add product at dashboard?"*
  2. *"Then why when I add image url example: https://pin.it/3vnkJ5nlE from pinterest doesn't show the image just alt? Why?"*
  3. *"As a seller how do we know what buyer was buy? Cause we only see invoice not chart at buyer or what buyer want to buys? And if we deleted the product or items at store product is that make broken order or something crash?"*
  4. *"When I opened the invoice it's just the cost for the product, not the name of the product so how do I know what buyer wants to buy? If two products have the same cost what should I do?"*
- **Root-Cause Architectural & UX Analysis:**
  1. *RLS Error 42501*: PostgREST rejected product insertion because the live database lacked an `INSERT` policy for the `public`/`anon` role. Provided the comprehensive SQL policy fix (`CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO public USING (true) WITH CHECK (true);`).
  2. *Pinterest Image Alt*: Short-link `pin.it/...` serves HTML webpage content rather than raw image bytes (JPEG/PNG/WebP), causing browser decoding failure. Advised on obtaining direct CDN addresses (`i.pinimg.com/...jpg` or Unsplash/ImgBB).
  3. *Relational Integrity on Product Deletion*: Explained that `order_items` foreign key `product_id REFERENCES products(id) ON DELETE RESTRICT` protects historical invoices from corruption and prevents broken orders.
  4. *Itemized Products Breakdown*: The initial invoice/dashboard modal rendered monetary totals with a summary package line. Updated all views to fetch and render exact itemized product breakdowns.
- **Key Engineering Actions:**
  1. Updated `src/app/admin/dashboard/page.tsx`: Added `selectedOrderItems` state, integrated `order_items` query with joined `products`, and embedded an interactive **Ordered Products & Quantities Breakdown** with thumbnails, SKU badges, unit prices, and subtotals.
  2. Updated `src/app/invoice/[id]/page.tsx`: Implemented dynamic table mapping over `orderItems` displaying item number, exact product name, category, SKU, quantity, unit price (DPP), and subtotal.
  3. Updated `src/app/order-success/[id]/page.tsx`: Integrated `order_items` loader and rendered the purchased item breakdown on the customer's printable receipt.
  4. Verified entire application with `npm run build` — 100% successful with 0 errors.

---

## 📅 Session 14: Granular Date & Time Order Filter & Chronological Sorting in Admin Dashboard
- **User Prompt:** *"Can you modify for admin dashboard? For add date&time filter order on live transaction & order"*
- **Architectural & Design Considerations:**
  1. *Multi-Dimensional Transaction Filtering*: Admins required both rapid chronological presets (Today, Yesterday, Last 24 Hours, Last 7 Days, Last 30 Days, This Month, All Time) and custom datetime range inputs (`<input type="datetime-local">`) to filter live incoming orders.
  2. *Bi-Directional Timestamp Sorting*: Integrated toggleable ascending (`Oldest First`) and descending (`Newest First`) sorting on the `created_at` timestamp with visual indicator arrows in both the toolbar and table column header.
  3. *Active Filter Summary & CSV Integration*: Filtered metrics calculate the exact volume and order count in real-time (`Showing X of Y orders • Filtered Total: Rp Z`), and the 1-click CSV/Excel exporter automatically produces time-scoped audit reports matching active date filters.
- **Key Engineering Actions:**
  1. Created `DatePreset` type and added state variables: `datePreset`, `startDate`, `endDate`, `sortOrder`, and `showCustomDatePicker` in `src/app/admin/dashboard/page.tsx`.
  2. Implemented `matchesDate()` filter evaluation and multi-dimensional sorting logic in `filteredOrders`.
  3. Styled and rendered the Date & Time filter toolbar in `src/app/admin/dashboard/page.tsx` featuring preset pill selectors, dark-mode native datetime pickers, active filter badges with 1-click dismiss, and a "Reset Filters" action.
  4. Made the `Date & Time` table header column clickable to dynamically toggle chronological sorting.
  5. Updated and synchronized documentation across `docs/PRD_AND_ERD.md`, `docs/SYSTEM_FLOWCHART.md`, `docs/AI_PROMPT_LOG.md`, `docs/User Documentation-Azmi.html`, and `README.md`.
  6. Verified production build with `npm run build` — 100% successful with 0 errors and 0 lint warnings.

---

## 📅 Session 15: Global Dashboard Date & Time Horizon & Analytics Synchronization
- **User Prompt:** *"If for all admin dashboard what we usually filter date&time use? Can we add date&time filter for all dashboard admin?"*
- **Architectural & Design Considerations:**
  1. *Executive Industry Pattern (Stripe/Shopify)*: Elevated the Date & Time filter from a local table filter into a **Global Dashboard Executive Horizon** controlling all dashboard metrics and charts.
  2. *Period Cascade (`periodOrders`)*: Computed unified `periodOrders` from which Executive KPI summary cards (Total Revenue, Order Volume, AOV, Fulfillment Rate) and Recharts visual analytics (Sales Revenue Stream AreaChart & Order Status Mix Donut Chart) dynamically recalculate.
  3. *Table & Drill-Down Alignment*: The Live Orders table lists transactions in the selected horizon with instant secondary filtering by status tabs, customer search, and chronological sorting.
- **Key Engineering Actions:**
  1. Positioned the **Global Dashboard Time Horizon Bar** above the KPI cards with rapid presets (All Time, Today, Yesterday, Last 24h, Last 7d, Last 30d, This Month, Custom Range), native dark-mode datetime pickers, and period metrics ribbon.
  2. Derived `totalRevenue`, `totalOrders`, `completedOrders`, `pendingOrders`, `averageOrderValue`, `fulfillmentRate`, `chartData`, and `statusPieData` strictly from `periodOrders`.
  3. Streamlined Live Transactions table toolbar with period-scoped status counts, search, and sorting.
  4. Synchronized all documentation across `docs/PRD_AND_ERD.md`, `docs/SYSTEM_FLOWCHART.md`, `docs/AI_PROMPT_LOG.md`, `docs/User Documentation-Azmi.html`, and `README.md`.
  5. Verified production build with `npm run build` — 100% successful with 0 errors and 0 lint warnings.


