# Task Breakdown & Tracking (task.md)

## 📌 Active Tasks: Global Admin Dashboard Date & Time Filter & Analytics Synchronization

### 1. Dashboard State & Global Cascade Logic
- [x] **Global Date Filter Bar Placement (`src/app/admin/dashboard/page.tsx`)**: Move date & time filter presets, custom datetime-local pickers, and active window badges to the global dashboard header.
- [x] **Period Orders Computation (`periodOrders`)**: Derive `periodOrders` based on `matchesDate(order.created_at)` for top-level analytics cascade.
- [x] **KPI Summary Metric Synchronization**: Dynamically recalculate Total Revenue, Total Orders, Average Order Value (AOV), and Fulfillment Rate from `periodOrders`.
- [x] **Visual Analytics Synchronization**: Update Recharts `AreaChart` (Sales Revenue Stream) and `PieChart` (Status Donut Mix) to plot `periodOrders`.
- [x] **Live Transactions Table Alignment**: Ensure table lists `periodOrders` with status filtering, live search, and chronological sorting.
- [x] **Global CSV Export Scope**: Ensure CSV export produces report matching the active global date & time window.

### 2. Documentation Synchronization
- [x] **PRD & ERD Synchronization (`docs/PRD_AND_ERD.md`)**: Document Global Dashboard Time Horizon analytics and KPI cascades.
- [x] **System Flowchart (`docs/SYSTEM_FLOWCHART.md`)**: Update Section 8 flowchart to reflect global dashboard filtering.
- [x] **AI Prompt Log (`docs/AI_PROMPT_LOG.md`)**: Log Session 15 for Global Dashboard Date Filter.
- [x] **HTML Documentation (`docs/User Documentation-Azmi.html`)**: Update user guide with Global Dashboard Date Filtering instructions.
- [x] **README (`README.md`)**: Update dashboard features list.

### 3. Verification & Quality Gate
- [x] **Build Validation**: Execute `npm run build` with 0 errors and 0 lint failures.
- [x] **Walkthrough Generation (`walkthrough.md`)**: Document changes and verification steps.
