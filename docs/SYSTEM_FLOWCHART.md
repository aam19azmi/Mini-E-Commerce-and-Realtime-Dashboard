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
        H["Server-Side State & Fallback Engine"]
        I["Real-time WebSocket Manager"]
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
    G --> K
    K -->|Database Triggers| L
    L -->|Instant Push Notification| E
    E -->|Approve Payment / Update Status| K
    E --> J
    E --> F
```

---

## 2. Guest Customer Checkout & Payment Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Guest Customer
    participant UI as NovaStore Storefront
    participant Map as Map Location Engine
    participant DB as Supabase PostgreSQL
    participant RT as Supabase Realtime
    actor Admin as Store Administrator

    Customer->>UI: Select products & specify quantities
    Customer->>UI: Open Checkout Form
    Customer->>Map: Pin GPS delivery location or type address
    Map-->>UI: Calculate KM distance & dynamic courier tariff
    UI->>UI: Auto-calculate 2.5% Admin Service Fee
    Customer->>UI: Choose Payment (QRIS / Bank Transfer / COD)
    opt Payment Screenshot Proof
        Customer->>UI: Upload Payment Receipt screenshot
    end
    Customer->>UI: Click "Place Order"
    UI->>DB: INSERT into orders & order_items
    DB-->>RT: Broadcast postgres_changes (INSERT event)
    RT-->>Admin: Instant Live Sound/Visual Alert on Dashboard!
    UI->>Customer: Display Order Confirmation & Official Tax Invoice
```

---

## 3. Real-time Order Verification & Fulfillment Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending: Guest Checkout Submitted
    Pending --> Processing: Admin Approves Payment Receipt Proof
    Pending --> Cancelled: Payment Invalid / Out of Stock
    Processing --> Completed: Courier Dispatched & Delivered
    Completed --> [*]
    Cancelled --> [*]
```
