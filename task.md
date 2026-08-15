# Task Breakdown & Tracking (task.md)

## 📌 Active & Completed Tasks

### 1. Catalog & Stock Resiliency Engine
- [x] **Unified Catalog Definition (`src/lib/defaultCatalog.ts`)**: Deterministic UUIDs and single source of truth for products & starter orders.
- [x] **Stock & Reset Manager (`src/lib/stockManager.ts`)**: Cascade-safe database deletions, cloud-local dual-layer stock decrement, instant window broadcast events, and real-time subscription helpers.
- [x] **Storefront Stock Reactivity (`src/app/page.tsx`)**: Subscribe to real-time `products` table changes and local broadcast events for instantaneous UI stock updates.
- [x] **Checkout Decrement Integration (`src/app/checkout/page.tsx`)**: Integrate `stockManager.deductStock()` during guest order submissions.
- [x] **Dashboard Dual-Channel & Reset Upgrade (`src/app/admin/dashboard/page.tsx`)**: Subscribing to both `orders` & `products`, implementing verified cascade reset routines, and stock restitution on order cancellation.

### 2. SQL Scripts & Stored Procedures
- [x] **Deterministic Seeders & RPC (`supabase/schema.sql` & `supabase/reset_database.sql`)**: Include fixed UUIDs and atomic `deduct_product_stock` and `reset_to_pristine_catalog` PostgreSQL functions.

### 3. Agent Rules & Governance
- [x] **Agent Rules Upgrade (`.agents/rules/AGENTS.md`)**: Embed Multi-Disciplinary Cognitive Matrix (CTO/IT, Accounting/Flowcash, Autonomous QA & Audit Gatekeeper) and Pre-Delivery Verification Checklist.

### 4. Documentation Synchronization
- [x] **PRD & ERD Synchronization (`docs/PRD_AND_ERD.md`)**: Document deterministic UUIDs, cascade deletion ordering, and dual-layer stock synchronization.
- [x] **System Flowchart (`docs/SYSTEM_FLOWCHART.md`)**: Update sequence diagrams for real-time stock sync and cascade reset flow.
- [x] **AI Prompt Log (`docs/AI_PROMPT_LOG.md`)**: Log Session 12 prompt, technical root cause analysis, and resolution.
- [x] **HTML Documentation (`docs/User Documentation-Azmi.html`)**: Update technical architecture, reset flow, and prompt logs.
- [x] **Walkthrough (`walkthrough.md`)**: Provide complete verification evidence and before/after comparisons.
- [x] **Production Build Check**: Execute `npm run build` with 0 errors.
