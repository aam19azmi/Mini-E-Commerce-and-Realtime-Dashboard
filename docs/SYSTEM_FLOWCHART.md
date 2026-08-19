# System Architecture & Flowcharts

## 1. High-Level Architecture Overview

NovaStore operates as a modern cloud-native single-merchant digital commerce platform using **Next.js (App Router)** and **Supabase (PostgreSQL, Realtime Engine, Auth)**.

```mermaid
graph TD
    subgraph Client_Layer["Client Layer"]
        A["Guest Shopper Storefront"]
        B["Interactive Cart Drawer"]
        C["Map Geolocation & Courier Selector"]
        D["Payment & Receipt Uploader"]
        E["Admin Real-time Dashboard"]
        F["Official Tax Invoice Generator"]
    end

    subgraph App_Layer["Application & API Layer (Next.js)"]
        G["Next.js App Router"]
        H["Server-Side State & Stock Manager Engine"]
        I["Real-time WebSocket Pub/Sub Manager"]
        J["CSV / Excel Financial Exporter"]
    end

    subgraph Data_Layer["Data & Storage Layer (Supabase)"]
        K[("PostgreSQL Database")]
        L["Supabase Realtime WebSockets"]
        M["Row Level Security / RLS"]
        N["Supabase Auth Service"]
    end

    A --> B
    B --> C
    C --> D
    D -->|Frictionless Checkout| G
    G --> H
    H --> K
    K -->|Database Triggers| L
    L -->|Instant Push Notification| E
    L -->|Stock Channel Broadcast| A
    E -->|Approve Payment / Update Status| H
    H --> K
    E --> J
    E --> F
```

---

## 2. Dual-Layer Guest Customer Checkout & Inventory Sync Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Guest Customer
    participant UI as NovaStore Storefront
    participant SM as Stock Manager (Cloud + Local)
    participant DB as Supabase PostgreSQL
    participant RT as Supabase Realtime Channel
    actor Admin as Store Administrator

    Customer->>UI: Select products & specify quantities
    Customer->>UI: Open Checkout Form
    Customer->>UI: Pin GPS delivery location or type address
    UI->>UI: Auto-calculate 2.5% Admin Service Fee & Courier Tariff
    Customer->>UI: Choose Payment (QRIS / Bank Transfer / COD)
    opt Payment Screenshot Proof
        Customer->>UI: Upload Payment Receipt screenshot
    end
    Customer->>UI: Click "Place Order"
    UI->>DB: INSERT into orders & order_items
    UI->>SM: deductStock(items)
    SM->>DB: UPDATE products / RPC deduct_product_stock
    SM->>SM: Set localStorage override & emit novastore:stock_updated
    DB-->>RT: Broadcast postgres_changes (orders + products)
    RT-->>Admin: Instant Live Visual & WebSocket Alert on Dashboard!
    RT-->>UI: Instantly updates stock badge & purchase limits across all open tabs!
    UI->>Customer: Display Order Confirmation & Official Tax Invoice
```

---

## 3. Real-time Order Verification & Inventory Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending: Guest Checkout Submitted (Stock Deducted)
    Pending --> Processing: Admin Approves Payment Receipt Proof
    Pending --> Cancelled: Payment Invalid / Rejected (Stock Automatically Replenished via restoreStock)
    Processing --> Completed: Courier Dispatched & Delivered
    Cancelled --> Processing: Admin Re-activates Order (Stock Re-deducted via deductStock)
    Completed --> [*]
    Cancelled --> [*]
```

---

## 4. Store Operations & Cascade-Safe Database Reset Architecture

```mermaid
flowchart TD
    Admin["Store Administrator"] --> Actions{"Admin Action"}
    
    Actions -->|"Simulate Order"| Sim["1-Click Real-time Order Simulation"]
    Sim -->|"Broadcasts WebSocket"| WS["Live Push Alert Toast"]
    
    Actions -->|"Reset Data Modal"| ResetModal{"Choose Reset Mode"}
    ResetModal -->|"Mode 1: Clear Orders"| ClearOrd["1. Delete order_items<br/>2. Delete orders<br/>(Keeps product inventory intact)"]
    ResetModal -->|"Mode 2: Pristine Restore"| Pristine["1. Cascade TRUNCATE order_items, orders, products<br/>2. Insert deterministic 6 products & 3 starter orders<br/>3. Clear local cache overrides"]
    
    ClearOrd --> Sync["Broadcasts novastore:orders_cleared -> Dashboard updates to 0 orders"]
    Pristine --> SyncReset["Broadcasts novastore:database_reset -> Refetches pristine state in all views"]
```

---

## 5. Zero-Flash Admin Authentication Guard Flow

```mermaid
flowchart TD
    User["User navigates to /admin/dashboard"] --> Guard{"isCheckingAuth || !isAuthorized"}
    
    Guard -->|"True (Default)"| Loader["Render Dark Security Clearance Screen<br/>(Zero Dashboard / Order UI Exposed)"]
    Loader --> Check["Check Supabase Auth Session & Demo Flag"]
    
    Check -->|"Invalid / No Session"| Redirect["router.replace('/admin/login')"]
    Check -->|"Valid Session / Demo Token"| Authorized["Set isAuthorized = true & isCheckingAuth = false"]
    
    Authorized --> Fetch["Execute fetchOrders() & fetchProducts()"]
    Fetch --> Sub["Subscribe to Realtime WebSockets (orders + products)"]
    Sub --> Render["Render Full Operations Dashboard & Charts"]
```

---

## 6. Customer Return & Refund (RMA) Lifecycle Flow

```mermaid
flowchart LR
    A["1. Customer Submits Return<br/>(Order ID & Unboxing Video)"] --> B["2. Customer Ships Item<br/>(To Cyber 2 Tower Jakarta Hub)"]
    B --> C["3. Warehouse Physical Inspection<br/>(Verifies Condition & Serial Tags)"]
    C --> D["4. Admin Updates Status to 'Cancelled'<br/>(Product Stock Automatically Restored)"]
    D --> E["5. 100% Monetary Refund Issued<br/>(Within 24 Hours to Original Channel)"]
```

---

## 7. Itemized Product Details & Tax Invoice Inspection Flow

```mermaid
flowchart TD
    OrderSelect["Admin selects Order in Live Dashboard<br/>or clicks View Details"] --> QueryItems["Query order_items JOIN products<br/>WHERE order_id = target_order_id"]
    
    QueryItems --> RenderModal["Render Interactive Modal with:<br/>- Product Thumbnail Images<br/>- Exact Product Names & Categories<br/>- Item SKU Badges<br/>- Purchased Quantities & Unit DPP<br/>- Individual Subtotals"]
    
    RenderModal --> InvoiceClick["Admin clicks 'View & Print Official Tax Invoice'"]
    InvoiceClick --> InvoiceRoute["Route /invoice/[id]"]
    
    InvoiceRoute --> InvoiceGen["Generate Printable Corporate A4 Tax Invoice:<br/>1. Itemized Table (No, Description, Qty, DPP, Subtotal)<br/>2. Domestic 11% PPN / 0% Export Zero-Rated Tax<br/>3. 2.5% Platform Admin Fee & Shipping Tariff<br/>4. Scannable Digital QR Verification Code<br/>5. Authorized Cashier Officer Digital Stamp"]
```
