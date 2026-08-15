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

## 📅 Session 11: Persistent Reset State, Realtime Receipt Fix, Corporate Footer & Customer Return SOP
- **User Prompt:** "Now add rule again when you work or do something regarding implementation plan always create task.md or renew that base what will or you done. Is this mini e-commerce was do below (CSS reset, vendor prefixes, incognito)? I just testing Reset Data It's not work because when I refreshed browser the data is comeback. To view the attached receipt, I have to reload the page after changing the status in order to see it. Also, if a customer wants to return an item they ordered, what should we do? Should we change the footer content on storefront to information about NovaStore such as location, contact details, or other information instead? And for customer return they ordered should they delivery the ordered comeback to us first or we return they payment first?"
- **Key Engineering Actions:**
  1. Updated `.agents/rules/AGENTS.md` to mandate `task.md` creation and granular checklist maintenance alongside implementation plans.
  2. Fixed **Persistent Cleared State** on Reset Data by adding PostgreSQL `DELETE` RLS policies on `orders` / `order_items` in `supabase/schema.sql` and managing persistent state in `fetchOrders()`.
  3. Fixed **Realtime Receipt Preview** in `src/app/admin/dashboard/page.tsx` by merging WebSocket `UPDATE` events while preserving `payment_proof_url`.
  4. Built comprehensive corporate **`Footer.tsx`** featuring brand story, headquarters address in Jakarta, customer support contacts (+62 812-9876-5432 / support@novastore.com), operational hours, return policy guarantee, and logistics/payment partner badges.
  5. Documented and formalized the **Customer Return (RMA) SOP**: Customer ships item back to warehouse first &rarr; Physical inspection & verification &rarr; Status marked as `Cancelled` (stock automatically restored) &rarr; Full monetary refund issued within 24 hours.



