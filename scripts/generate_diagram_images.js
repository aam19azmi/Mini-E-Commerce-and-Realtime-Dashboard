const fs = require('fs');
const path = require('path');

// Generate SVG diagrams
const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');

const erdSvg = `
<svg width="900" height="520" viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <!-- Background Grid -->
  <defs>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>

  <!-- Title -->
  <text x="450" y="35" text-anchor="middle" fill="#F8FAFC" font-size="18" font-weight="bold">NOVASTORE — POSTGRESQL ENTITY RELATIONSHIP DIAGRAM (ERD)</text>
  <text x="450" y="55" text-anchor="middle" fill="#94A3B8" font-size="12">Single-Merchant Digital Commerce & Real-time Operations Schema</text>

  <!-- PRODUCTS Table -->
  <g transform="translate(40, 80)">
    <rect width="250" height="380" rx="12" fill="#0F172A" stroke="#4F46E5" stroke-width="2"/>
    <rect width="250" height="40" rx="12" fill="#4F46E5"/>
    <rect y="25" width="250" height="15" fill="#4F46E5"/>
    <text x="125" y="25" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="bold">📦 PRODUCTS</text>
    
    <g transform="translate(15, 60)" font-size="11" fill="#E2E8F0">
      <text y="0" font-weight="bold" fill="#38BDF8">🔑 id: UUID (PK)</text>
      <text y="24">name: VARCHAR(255)</text>
      <text y="48">description: TEXT</text>
      <text y="72" fill="#4ADE80">price: NUMERIC(12,2)</text>
      <text y="96" fill="#FBBF24">stock: INTEGER</text>
      <text y="120">image_url: TEXT</text>
      <text y="144">category: VARCHAR(100)</text>
      <text y="168">seller_email: VARCHAR</text>
      <text y="192">seller_name: VARCHAR</text>
      <text y="216" fill="#94A3B8">created_at: TIMESTAMPTZ</text>
      <line x1="0" y1="235" x2="220" y2="235" stroke="#334155" stroke-width="1"/>
      <text y="255" fill="#A855F7" font-size="10">RLS: Public Read (SELECT)</text>
      <text y="272" fill="#A855F7" font-size="10">RLS: Admin Manage (ALL)</text>
    </g>
  </g>

  <!-- ORDERS Table -->
  <g transform="translate(610, 80)">
    <rect width="250" height="410" rx="12" fill="#0F172A" stroke="#06B6D4" stroke-width="2"/>
    <rect width="250" height="40" rx="12" fill="#06B6D4"/>
    <rect y="25" width="250" height="15" fill="#06B6D4"/>
    <text x="125" y="25" text-anchor="middle" fill="#0F172A" font-size="14" font-weight="bold">🛒 ORDERS</text>
    
    <g transform="translate(15, 60)" font-size="11" fill="#E2E8F0">
      <text y="0" font-weight="bold" fill="#38BDF8">🔑 id: UUID (PK)</text>
      <text y="22">customer_name: VARCHAR</text>
      <text y="44">customer_email: VARCHAR</text>
      <text y="66">customer_phone: VARCHAR</text>
      <text y="88">customer_address: TEXT</text>
      <text y="110" font-weight="bold" fill="#4ADE80">total_amount: NUMERIC</text>
      <text y="132" fill="#FBBF24">admin_fee (2.5%): NUMERIC</text>
      <text y="154">shipping_courier: VARCHAR</text>
      <text y="176">shipping_cost: NUMERIC</text>
      <text y="198" fill="#38BDF8">destination_lat/lng: NUMERIC</text>
      <text y="220">payment_proof_url: TEXT</text>
      <text y="242">payment_verified: BOOLEAN</text>
      <text y="264" fill="#F43F5E">status: VARCHAR(50)</text>
      <text y="286">payment_method: VARCHAR</text>
      <text y="308" fill="#94A3B8">created_at: TIMESTAMPTZ</text>
      <line x1="0" y1="322" x2="220" y2="322" stroke="#334155" stroke-width="1"/>
      <text y="338" fill="#A855F7" font-size="10">RLS: Public INSERT (Guest)</text>
    </g>
  </g>

  <!-- ORDER_ITEMS Table (Junction) -->
  <g transform="translate(325, 140)">
    <rect width="250" height="280" rx="12" fill="#0F172A" stroke="#10B981" stroke-width="2"/>
    <rect width="250" height="40" rx="12" fill="#10B981"/>
    <rect y="25" width="250" height="15" fill="#10B981"/>
    <text x="125" y="25" text-anchor="middle" fill="#0F172A" font-size="14" font-weight="bold">📋 ORDER_ITEMS</text>
    
    <g transform="translate(15, 60)" font-size="11" fill="#E2E8F0">
      <text y="0" font-weight="bold" fill="#38BDF8">🔑 id: UUID (PK)</text>
      <text y="24" fill="#F43F5E">🔗 order_id: UUID (FK)</text>
      <text y="48" fill="#4F46E5">🔗 product_id: UUID (FK)</text>
      <text y="72" font-weight="bold" fill="#FBBF24">quantity: INTEGER</text>
      <text y="96">unit_price: NUMERIC(12,2)</text>
      <text y="120" fill="#4ADE80">subtotal: NUMERIC(12,2)</text>
      <text y="144" fill="#94A3B8">created_at: TIMESTAMPTZ</text>
      <line x1="0" y1="165" x2="220" y2="165" stroke="#334155" stroke-width="1"/>
      <text y="185" fill="#A855F7" font-size="10">Multi-Product Support 1:N</text>
    </g>
  </g>

  <!-- Connecting Lines -->
  <!-- Products to Order Items -->
  <path d="M 290 250 L 325 250" stroke="#4F46E5" stroke-width="3" fill="none" stroke-dasharray="4"/>
  <circle cx="295" cy="250" r="4" fill="#4F46E5"/>
  <text x="302" y="240" fill="#E2E8F0" font-size="10" font-weight="bold">1:N</text>

  <!-- Orders to Order Items -->
  <path d="M 610 250 L 575 250" stroke="#06B6D4" stroke-width="3" fill="none" stroke-dasharray="4"/>
  <circle cx="605" cy="250" r="4" fill="#06B6D4"/>
  <text x="585" y="240" fill="#E2E8F0" font-size="10" font-weight="bold">1:N</text>
</svg>
`;

const archSvg = `
<svg width="900" height="520" viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <!-- Title -->
  <text x="450" y="35" text-anchor="middle" fill="#F8FAFC" font-size="18" font-weight="bold">NOVASTORE — SYSTEM ARCHITECTURE & DATA FLOW</text>
  <text x="450" y="55" text-anchor="middle" fill="#94A3B8" font-size="12">Next.js 16 App Router & Supabase PostgreSQL Real-time WebSockets</text>

  <!-- Layer 1: Client / Presentation Layer -->
  <g transform="translate(30, 80)">
    <rect width="250" height="400" rx="14" fill="#0F172A" stroke="#334155" stroke-width="2"/>
    <rect width="250" height="35" rx="14" fill="#1E293B"/>
    <rect y="20" width="250" height="15" fill="#1E293B"/>
    <text x="125" y="23" text-anchor="middle" fill="#38BDF8" font-size="12" font-weight="bold">🌐 CLIENT LAYER (UI/UX)</text>

    <!-- Sub-blocks -->
    <g transform="translate(15, 50)">
      <rect width="220" height="45" rx="8" fill="#1E293B" stroke="#4F46E5"/>
      <text x="110" y="20" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Guest Shopper Storefront</text>
      <text x="110" y="35" text-anchor="middle" fill="#94A3B8" font-size="9">Catalog Search & Category Filters</text>
    </g>
    <g transform="translate(15, 105)">
      <rect width="220" height="45" rx="8" fill="#1E293B" stroke="#4F46E5"/>
      <text x="110" y="20" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Cart Drawer & Map Location</text>
      <text x="110" y="35" text-anchor="middle" fill="#94A3B8" font-size="9">OpenStreetMap Pinning & Couriers</text>
    </g>
    <g transform="translate(15, 160)">
      <rect width="220" height="45" rx="8" fill="#1E293B" stroke="#4F46E5"/>
      <text x="110" y="20" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Guest Checkout Form</text>
      <text x="110" y="35" text-anchor="middle" fill="#94A3B8" font-size="9">2.5% Fee & Proof Screenshot</text>
    </g>
    <g transform="translate(15, 215)">
      <rect width="220" height="45" rx="8" fill="#1E293B" stroke="#06B6D4"/>
      <text x="110" y="20" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Admin Operations Dashboard</text>
      <text x="110" y="35" text-anchor="middle" fill="#94A3B8" font-size="9">Live KPI Recharts & Orders Table</text>
    </g>
    <g transform="translate(15, 270)">
      <rect width="220" height="45" rx="8" fill="#1E293B" stroke="#06B6D4"/>
      <text x="110" y="20" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Payment Verification Lightbox</text>
      <text x="110" y="35" text-anchor="middle" fill="#94A3B8" font-size="9">1-Click Approve / Reject Proof</text>
    </g>
    <g transform="translate(15, 325)">
      <rect width="220" height="45" rx="8" fill="#1E293B" stroke="#10B981"/>
      <text x="110" y="20" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Official Corporate Tax Invoice</text>
      <text x="110" y="35" text-anchor="middle" fill="#94A3B8" font-size="9">DPP + PPN 11% & QR Validation</text>
    </g>
  </g>

  <!-- Layer 2: Next.js Application Layer -->
  <g transform="translate(325, 80)">
    <rect width="250" height="400" rx="14" fill="#0F172A" stroke="#334155" stroke-width="2"/>
    <rect width="250" height="35" rx="14" fill="#1E293B"/>
    <rect y="20" width="250" height="15" fill="#1E293B"/>
    <text x="125" y="23" text-anchor="middle" fill="#A855F7" font-size="12" font-weight="bold">⚙️ NEXT.JS APPLICATION LAYER</text>

    <g transform="translate(15, 55)">
      <rect width="220" height="65" rx="8" fill="#1E293B" stroke="#6366F1"/>
      <text x="110" y="22" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">App Router & Server Engine</text>
      <text x="110" y="40" text-anchor="middle" fill="#94A3B8" font-size="9">Turbopack compilation</text>
      <text x="110" y="54" text-anchor="middle" fill="#94A3B8" font-size="9">TypeScript Strict Architecture</text>
    </g>
    <g transform="translate(15, 135)">
      <rect width="220" height="65" rx="8" fill="#1E293B" stroke="#6366F1"/>
      <text x="110" y="22" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Logistics & Tariff Matrix</text>
      <text x="110" y="40" text-anchor="middle" fill="#94A3B8" font-size="9">Haversine distance calculation</text>
      <text x="110" y="54" text-anchor="middle" fill="#94A3B8" font-size="9">JNE, J&amp;T, SPX, SiCepat, Instant</text>
    </g>
    <g transform="translate(15, 215)">
      <rect width="220" height="65" rx="8" fill="#1E293B" stroke="#6366F1"/>
      <text x="110" y="22" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Financial Engine (2.5% Fee)</text>
      <text x="110" y="40" text-anchor="middle" fill="#94A3B8" font-size="9">Automated platform fee formula</text>
      <text x="110" y="54" text-anchor="middle" fill="#94A3B8" font-size="9">Corporate PPN 11% Tax Invoicing</text>
    </g>
    <g transform="translate(15, 295)">
      <rect width="220" height="65" rx="8" fill="#1E293B" stroke="#6366F1"/>
      <text x="110" y="22" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">CSV Financial Exporter</text>
      <text x="110" y="40" text-anchor="middle" fill="#94A3B8" font-size="9">1-Click Excel/CSV report generator</text>
      <text x="110" y="54" text-anchor="middle" fill="#94A3B8" font-size="9">Full accounting transaction export</text>
    </g>
  </g>

  <!-- Layer 3: Database & Realtime Layer -->
  <g transform="translate(620, 80)">
    <rect width="250" height="400" rx="14" fill="#0F172A" stroke="#334155" stroke-width="2"/>
    <rect width="250" height="35" rx="14" fill="#1E293B"/>
    <rect y="20" width="250" height="15" fill="#1E293B"/>
    <text x="125" y="23" text-anchor="middle" fill="#10B981" font-size="12" font-weight="bold">🗄️ SUPABASE BACKEND LAYER</text>

    <g transform="translate(15, 60)">
      <rect width="220" height="65" rx="8" fill="#1E293B" stroke="#10B981"/>
      <text x="110" y="22" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">PostgreSQL 15+ Database</text>
      <text x="110" y="40" text-anchor="middle" fill="#94A3B8" font-size="9">products, orders, order_items</text>
      <text x="110" y="54" text-anchor="middle" fill="#94A3B8" font-size="9">Indexed query execution</text>
    </g>
    <g transform="translate(15, 145)">
      <rect width="220" height="65" rx="8" fill="#1E293B" stroke="#10B981"/>
      <text x="110" y="22" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Supabase Realtime Engine</text>
      <text x="110" y="40" text-anchor="middle" fill="#94A3B8" font-size="9">PostgreSQL CDC (Change Data)</text>
      <text x="110" y="54" text-anchor="middle" fill="#94A3B8" font-size="9">Instant WebSocket broadcasts</text>
    </g>
    <g transform="translate(15, 230)">
      <rect width="220" height="65" rx="8" fill="#1E293B" stroke="#10B981"/>
      <text x="110" y="22" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Row Level Security (RLS)</text>
      <text x="110" y="40" text-anchor="middle" fill="#94A3B8" font-size="9">Public Guest INSERT enabled</text>
      <text x="110" y="54" text-anchor="middle" fill="#94A3B8" font-size="9">Admin authenticated security</text>
    </g>
    <g transform="translate(15, 315)">
      <rect width="220" height="65" rx="8" fill="#1E293B" stroke="#10B981"/>
      <text x="110" y="22" text-anchor="middle" fill="#F8FAFC" font-size="11" font-weight="bold">Supabase Auth Service</text>
      <text x="110" y="40" text-anchor="middle" fill="#94A3B8" font-size="9">JWT Token session validation</text>
      <text x="110" y="54" text-anchor="middle" fill="#94A3B8" font-size="9">Protected admin dashboard routes</text>
    </g>
  </g>

  <!-- Connectors -->
  <path d="M 280 200 L 325 200" stroke="#6366F1" stroke-width="3" fill="none"/>
  <path d="M 575 200 L 620 200" stroke="#10B981" stroke-width="3" fill="none"/>
  <path d="M 620 300 L 575 300" stroke="#06B6D4" stroke-width="3" fill="none"/>
  <path d="M 325 300 L 280 300" stroke="#06B6D4" stroke-width="3" fill="none"/>
</svg>
`;

fs.writeFileSync(path.join(screenshotsDir, '00_erd_diagram.svg'), erdSvg);
fs.writeFileSync(path.join(screenshotsDir, '00_architecture_diagram.svg'), archSvg);

console.log('✅ Generated SVG diagrams for ERD and Architecture in docs/screenshots/');
