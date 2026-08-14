# AI Prompt & Development Log

This document records the prompts, architectural decisions, and AI-assisted workflows used during the development of the **Mini E-Commerce and Realtime Dashboard**.

---

## Session 1: Project Scoping, Rules & Architecture Planning
- **Date & Time:** August 14, 2026
- **User Prompt:** Provided technical test instructions & specifications (Guest Checkout, Multi-Product support, Real-time Admin Dashboard, Next.js + Supabase + Vercel deployment, English documentation requirement, Free tier constraints).
- **AI Actions Taken:**
  1. Formulated `.agents/rules/AGENTS.md` specifying architecture constraints, Supabase free-tier limits, and core guidelines.
  2. Created `implementation_plan.md` featuring preliminary PRD, ERD, and flowcharts.
  3. Cleaned and structured project root workspace.
  4. Clarified questions on package managers (`npm`), Supabase setup sequence, domain management, and multi-repo Vercel support.

---

## Session 2: Database Schema & Submission Documentation Setup
- **User Prompt:** "Okay thanks then I'll create subdomain for the last. We are ready to start"
- **AI Actions Taken:**
  1. Bootstrapped Next.js with App Router, TypeScript, and Tailwind CSS.
  2. Generated `supabase/schema.sql` encompassing:
     - `products`, `orders`, and `order_items` tables.
     - Row Level Security (RLS) policies for guest buyers and authenticated admins.
     - Real-time PostgreSQL publication (`supabase_realtime`).
     - Realistic seed product dataset in Indonesian Rupiah (IDR).
  3. Created `docs/PRD_AND_ERD.md` containing detailed requirements and Mermaid ERD.
  4. Created `docs/SYSTEM_FLOWCHART.md` detailing system workflows and sequence diagrams.

---

## Session 3: Full-Stack Implementation
- **AI Actions Taken:**
  1. Configured Supabase client in `src/lib/supabase.ts` supporting both `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  2. Installed dependencies: `@supabase/supabase-js`, `lucide-react`, `recharts`, `canvas-confetti`, `clsx`, `tailwind-merge`.
  3. Developed `CartContext.tsx` with persistent `localStorage` and multi-product cart management.
  4. Implemented `Navbar.tsx` and `CartDrawer.tsx` with live badge count and slide-over cart drawer.
  5. Built Storefront (`src/app/page.tsx`) with product filtering, category tabs, and responsive cards (`ProductCard.tsx`).
  6. Built Guest Checkout (`src/app/checkout/page.tsx`) inserting orders and order line items directly to Supabase.
  7. Built Order Confirmation (`src/app/order-success/[id]/page.tsx`) with celebratory confetti and receipt details.
  8. Built Admin Login (`src/app/admin/login/page.tsx`) with Supabase Auth and one-click demo access for reviewers.
  9. Built Real-time Admin Dashboard (`src/app/admin/dashboard/page.tsx`) with Supabase WebSocket subscriptions, KPI cards, visual Recharts (Area and Pie), live orders table, instant status updater, and order simulation trigger.

---

## Session 4: Verification, RLS Optimization & Database Sync
- **AI Actions Taken:**
  1. Saved high-resolution screenshots to `docs/screenshots/` and documented in `docs/SCREENSHOTS.md`.
  2. Resolved RLS `SELECT` policy constraints for the `orders` table to allow persistent reads across page refreshes.
  3. Executed full idempotent database migration in Supabase SQL editor (`products`, `orders`, `order_items`, RLS, Realtime publication).
  4. Verified full end-to-end flow: Guest checkout order creation -> WebSocket real-time broadcast -> Permanent database persistence across page reloads.

---

## Session 5: Advanced Features & Invoice Architecture Enhancement
- **AI Actions Taken:**
  1. **Modern Delete Confirmation Dialog**: Replaced `window.confirm()` with custom glassmorphism modal with warning indicators and confirmation buttons.
  2. **Dedicated Clean Invoice Page (`/invoice/[id]`)**: Standalone corporate tax invoice route with scannable QR verification code and exact Indonesian tax arithmetic (`DPP + PPN 11% = Grand Total`).
  3. **Export Orders to CSV/Excel**: One-click `.csv` generation in the Admin Dashboard.
  4. **Product Catalog CRUD**: Full Add/Edit/Delete product capabilities directly synced with Supabase.
  5. **Protected Admin Route Guard & Seller Registration**: Added client-side session guard on `/admin/dashboard` redirecting unauthorized visits to `/admin/login`, added Seller Sign Up / Registration tab, and added a Logout/Sign Out action.

---

## Session 6: Multi-Seller & Multi-Vendor Marketplace Isolation
- **User Prompt:** "The account I registered still display the same product and stock listings, as well as the same live transactions and orders. In my view, these should differ, as different admins or seller might be selling distinct products and stock..."
- **AI Actions Taken:**
  1. **Seller-Specific Product Isolation**: When a seller registers and adds products, those items are strictly linked to `seller_email: currentAdminEmail`. Each seller only sees, modifies, and manages their own inventory.
  2. **Seller-Specific Orders & Analytics**: Real-time sales transactions, KPI totals (Revenue, Orders, Completed, Pending), Area chart streams, and Status donut graphs are computed strictly for the active seller's store.
  3. **Storefront Merchant Attribution**: All marketplace products appear on the public storefront with an active `🏬 Merchant: [seller]` badge.
  4. **Merchant & Cashier Stamping on Invoices**: The Tax Invoice features a 3-column layout displaying the **Official Seller / Merchant**, **Buyer & Destination**, and the **Issuing Cashier Officer**.
