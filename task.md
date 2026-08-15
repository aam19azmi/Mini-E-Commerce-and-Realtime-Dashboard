# Task Breakdown & Tracking (task.md)

## 📌 Active & Completed Task Items

### 1. Catalog Inventory Management & Stock Automation
- [x] **Automatic Stock Decrement on Order Placement**: Deduct purchased quantities from `products.stock` during checkout submission.
- [x] **Automatic Stock Restitution on Cancellation**: Restore ordered item quantities to `products.stock` when order status transitions to `cancelled`.
- [x] **Inventory Re-deduction on Order Reactivation**: Re-deduct stock if an order is un-cancelled back to `pending`/`processing`.
- [x] **Catalog Action Button De-duplication**: Remove redundant "Add Product" button from the top navbar, standardizing on the catalog card header button.

### 2. Database Management & Reset Modes
- [x] **1-Click Database Reset Modal in Admin Dashboard**: Added modal with two distinct demonstration modes.
- [x] **Mode 1 (Clear Orders)**: Zero out orders and order_items tables (0 orders) while keeping product catalog intact.
- [x] **Mode 2 (Pristine Restore)**: Restore 6 flagship electronics products and 3 starter demonstration orders.
- [x] **Admin Account Security & Isolation**: Guaranteed isolation of `admin@novastore.com` in Supabase Auth.
- [x] **Standalone SQL Reset Script**: Maintained `supabase/reset_database.sql` for PostgreSQL SQL Editor usage.

### 3. Geolocation, Logistics & Customs Engine
- [x] **Interactive Leaflet Map**: Enabled click-to-pin, draggable marker, and GPS auto-detect.
- [x] **Indonesian & Global Cities Search Geocoding**: Instant offline dictionary for Indonesian regions + Nominatim global fallback.
- [x] **4-Tier Logistics Classifier**: Local Motorbike (< 35km), Overland Express (35-750km), Inter-Island Air/Sea (750-3800km), International Air Freight (> 3800km).
- [x] **Dynamic Courier Fleet Switching**: Domestic (JNE, J&T, SPX, SiCepat, Instant Bike) vs. International (DHL, FedEx, Pos Indonesia EMS, UPS Worldwide).
- [x] **Customs (Bea Cukai) & Tax Compliance**: Itemized DPP, PPN 11% domestic, 0% Indonesian export tariff, 0% VAT export zero-rated, and destination DDU customs terms.

### 4. Agent Rules & Documentation Protocols
- [x] **Agent Rules (`.agents/rules/AGENTS.md`)**: Added mandatory `implementation_plan.md`, `task.md`, `walkthrough.md`, and `docs/` synchronization rules.
- [x] **PRD & ERD Document (`docs/PRD_AND_ERD.md`)**: Synchronized with latest tax formulas, logistics tiers, stock automation, and reset modes.
- [x] **System Flowchart (`docs/SYSTEM_FLOWCHART.md`)**: Synchronized sequence diagrams, inventory restitution lifecycle, and reset architecture.
- [x] **AI Prompt Log (`docs/AI_PROMPT_LOG.md`)**: Appended full records for Session 9 and Session 10.
- [x] **User Documentation (`docs/User Documentation-Azmi.html`)**: Synchronized candidate details, live URLs, credentials, prompt logs, and technical specs.
- [x] **Walkthrough Document (`walkthrough.md`)**: Detailed all recent code changes, verification outcomes, and testing evidence.
- [x] **Production Build Validation**: Ran `npm run build` — 100% compiled with 0 errors.
