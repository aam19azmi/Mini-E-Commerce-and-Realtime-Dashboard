const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
} = require('docx');

async function generateDocx() {
  const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');

  // Helper to load and embed image safely
  const embedImage = (filename, width = 500, height = 270) => {
    const filePath = path.join(screenshotsDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        const buffer = fs.readFileSync(filePath);
        return [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 150, after: 100 },
            children: [
              new ImageRun({
                data: buffer,
                transformation: {
                  width: width,
                  height: height,
                },
              }),
            ],
          }),
        ];
      } catch (err) {
        console.error('Error reading image:', filename, err);
      }
    }
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 100 },
        children: [
          new TextRun({
            text: `[Illustration: ${filename}]`,
            italics: true,
            color: '64748B',
          }),
        ],
      }),
    ];
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'NovaStore — Mini E-Commerce & Realtime Dashboard',
                bold: true,
                size: 36,
                color: '1E1B4B',
              }),
            ],
          }),

          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'Official Submission Package & Comprehensive Technical Documentation',
                italics: true,
                size: 22,
                color: '4F46E5',
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Candidate Name:', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Azmi', bold: true })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Subject Email:', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('User Documentation-Azmi')] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Target Email:', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('amartawiragunamandiri@gmail.com')] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tech Stack:', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Next.js 16 (App Router, Turbopack), Supabase (PostgreSQL & Realtime), Tailwind CSS, Vercel')] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Live Production URL:', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('https://shop.sourcecodejournal.dev (Vercel Edge)')] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200, after: 100 } }),

          // ==========================================
          // 1. PRD
          // ==========================================
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '1. Product Requirement Document (PRD)',
                bold: true,
                size: 28,
                color: '4338CA',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '1.1 Executive Summary & Mission\n', bold: true }),
              new TextRun(
                'NovaStore is an enterprise-grade digital commerce platform engineered for single-merchant operations. It provides a frictionless guest checkout experience for customers while equipping store administrators with a real-time command center powered by Supabase PostgreSQL WebSockets.'
              ),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 80 },
            children: [new TextRun({ text: '1.2 Core Specifications & Functional Modules:', bold: true })],
          }),

          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• Frictionless Guest Checkout (Multi-Product): ', bold: true }),
              new TextRun('Zero registration or login barrier. Customers browse catalog items, adjust quantities, add multiple different products to cart, and place consolidated orders directly.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• Interactive Map Geolocation (OpenStreetMap & GPS): ', bold: true }),
              new TextRun('Customers pin their exact delivery coordinates on an interactive map or click "Use My Current GPS" for precision routing.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• Multi-Courier Dynamic Logistics Engine: ', bold: true }),
              new TextRun('Dynamic tariff estimation based on Haversine distance from the Central Warehouse Hub across JNE Express, J&T Express, Shopee Xpress, SiCepat, and Instant Courier.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• 2.5% Administrative Service Fee: ', bold: true }),
              new TextRun('Automatically calculated as Math.round(cartTotal * 0.025) and transparently itemized across checkout, receipts, tax invoices, and sales reports.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• Zero-Fee Direct Payment Verification: ', bold: true }),
              new TextRun('0% MDR Instant QRIS and Direct Bank Transfer (BCA, Mandiri) with payment receipt screenshot upload and 1-click admin approval/rejection.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• Real-Time Operations Dashboard: ', bold: true }),
              new TextRun('Live WebSocket order broadcast alerts without page reloads, visual KPI analytics graphs, full product catalog CRUD, and 1-click CSV/Excel financial export.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• Official Commercial Tax Invoices: ', bold: true }),
              new TextRun('Dedicated /invoice/[id] route formatted with DPP, 11% PPN breakdown, administrative fees, courier delivery line item, and scannable QR verification code.'),
            ],
          }),

          // 1.3 Mathematical Formulas
          new Paragraph({
            spacing: { before: 150, after: 80 },
            children: [new TextRun({ text: '1.3 Financial Calculation Formulations:', bold: true })],
          }),
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({ text: '• Product Subtotal = ', bold: true }),
              new TextRun('Sum(Unit Price * Quantity) for all items.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({ text: '• Shipping Tariff = ', bold: true }),
              new TextRun('Base Cost + (Haversine Distance in KM * Per KM Tariff).'),
            ],
          }),
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({ text: '• Admin Fee (Biaya Layanan 2.5%) = ', bold: true }),
              new TextRun('Round(Product Subtotal * 0.025).'),
            ],
          }),
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({ text: '• Grand Total = ', bold: true }),
              new TextRun('Product Subtotal + Shipping Tariff + Admin Fee.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({ text: '• Tax Base (DPP) = ', bold: true }),
              new TextRun('Round(Product Subtotal / 1.11).'),
            ],
          }),
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({ text: '• PPN 11% = ', bold: true }),
              new TextRun('Product Subtotal - DPP.'),
            ],
          }),

          // ==========================================
          // 2. ERD & SCHEMA
          // ==========================================
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '2. Entity Relationship Diagram (ERD) & Schema',
                bold: true,
                size: 28,
                color: '4338CA',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                'The database is structured in PostgreSQL on Supabase with Row Level Security (RLS) policies and performance indexes:'
              ),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 60 },
            children: [new TextRun({ text: 'A. products Table Schema:', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• id (UUID, PK) — Unique product identifier')] }),
          new Paragraph({ children: [new TextRun('• name (VARCHAR 255, NOT NULL) — Product title')] }),
          new Paragraph({ children: [new TextRun('• description (TEXT) — Detailed specification')] }),
          new Paragraph({ children: [new TextRun('• price (NUMERIC 12,2, NOT NULL) — Unit price in IDR')] }),
          new Paragraph({ children: [new TextRun('• stock (INTEGER, NOT NULL) — Available inventory count')] }),
          new Paragraph({ children: [new TextRun('• image_url (TEXT) — High-res Unsplash image URL')] }),
          new Paragraph({ children: [new TextRun('• category (VARCHAR 100) — Electronics, Audio, Wearables, Accessories, Lifestyle')] }),
          new Paragraph({ children: [new TextRun('• created_at (TIMESTAMPTZ, NOT NULL)')] }),

          new Paragraph({
            spacing: { before: 100, after: 60 },
            children: [new TextRun({ text: 'B. orders Table Schema (with Logistics & Fee Engine):', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• id (UUID, PK) — Unique order identifier')] }),
          new Paragraph({ children: [new TextRun('• customer_name (VARCHAR 255, NOT NULL) — Buyer full name')] }),
          new Paragraph({ children: [new TextRun('• customer_email (VARCHAR 255, NOT NULL) — Buyer email address')] }),
          new Paragraph({ children: [new TextRun('• customer_phone (VARCHAR 50) — Buyer contact number')] }),
          new Paragraph({ children: [new TextRun('• customer_address (TEXT, NOT NULL) — Delivery destination and notes')] }),
          new Paragraph({ children: [new TextRun('• total_amount (NUMERIC 12,2, NOT NULL) — Grand Total in IDR')] }),
          new Paragraph({ children: [new TextRun('• admin_fee (NUMERIC 12,2) — 2.5% administrative service fee')] }),
          new Paragraph({ children: [new TextRun('• shipping_courier (VARCHAR 100) — Selected courier service')] }),
          new Paragraph({ children: [new TextRun('• shipping_cost (NUMERIC 12,2) — Calculated distance-based logistics tariff')] }),
          new Paragraph({ children: [new TextRun('• destination_lat & destination_lng (NUMERIC 10,7) — GPS delivery map coordinates')] }),
          new Paragraph({ children: [new TextRun('• payment_proof_url (TEXT) — Base64 receipt screenshot proof')] }),
          new Paragraph({ children: [new TextRun('• payment_verified (BOOLEAN) — True when admin approves payment')] }),
          new Paragraph({ children: [new TextRun('• status (VARCHAR 50) — pending | processing | completed | cancelled')] }),
          new Paragraph({ children: [new TextRun('• payment_method (VARCHAR 50) — qris | bank_transfer | cash_on_delivery')] }),
          new Paragraph({ children: [new TextRun('• created_at (TIMESTAMPTZ, NOT NULL)')] }),

          new Paragraph({
            spacing: { before: 100, after: 60 },
            children: [new TextRun({ text: 'C. order_items Table Schema:', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• id (UUID, PK) — Unique line item identifier')] }),
          new Paragraph({ children: [new TextRun('• order_id (UUID, FK -> orders.id, ON DELETE CASCADE)')] }),
          new Paragraph({ children: [new TextRun('• product_id (UUID, FK -> products.id, ON DELETE RESTRICT)')] }),
          new Paragraph({ children: [new TextRun('• quantity (INTEGER, NOT NULL, CHECK > 0)')] }),
          new Paragraph({ children: [new TextRun('• unit_price (NUMERIC 12,2, NOT NULL) — Unit price locked at purchase time')] }),
          new Paragraph({ children: [new TextRun('• subtotal (NUMERIC 12,2, NOT NULL) — quantity * unit_price')] }),
          new Paragraph({ children: [new TextRun('• created_at (TIMESTAMPTZ, NOT NULL)')] }),

          // ==========================================
          // 3. SYSTEM ARCHITECTURE & FLOWCHART
          // ==========================================
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3. System Architecture & Flowchart (Alur Pikir)',
                bold: true,
                size: 28,
                color: '4338CA',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '3.1 Guest Customer Ordering Flow:\n', bold: true }),
              new TextRun('1. Catalog Browsing: Customer explores products, filters by category, or searches in real time.\n'),
              new TextRun('2. Cart Composition: Customer selects multiple diverse products and adjusts quantities in the slide-over cart drawer.\n'),
              new TextRun('3. Map Geolocation Pinning: Customer opens checkout, inputs contact details, and pins delivery GPS coordinates on the interactive OpenStreetMap tile.\n'),
              new TextRun('4. Courier Tariff Calculation: System computes Haversine distance in KM from Central Jakarta Hub and displays tariffs for JNE, J&T, SPX, SiCepat, or Instant Courier.\n'),
              new TextRun('5. 2.5% Fee & Payment Proof: System applies the 2.5% service fee. Customer chooses QRIS or Bank Transfer, transferring directly and uploading a payment screenshot.\n'),
              new TextRun('6. Order Dispatch & Broadcast: Order is saved in Supabase PostgreSQL, immediately broadcasting a real-time WebSocket event to the Admin Dashboard.\n'),
              new TextRun('7. Invoicing: Customer receives an Order Confirmation receipt with a direct link to view/print their verified corporate commercial tax invoice.\n'),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: '3.2 Admin Real-Time Operations Flow:\n', bold: true }),
              new TextRun('1. Access: Admin logs in via Supabase Auth or 1-Click Instant Demo Admin Access.\n'),
              new TextRun('2. WebSocket Subscription: Dashboard connects to public.orders PostgreSQL change stream via WebSockets.\n'),
              new TextRun('3. Live Notification: When an order is placed, dashboard flashes an animated toast banner and updates revenue charts without page reload.\n'),
              new TextRun('4. Payment Verification: Admin inspects the attached QRIS/Bank transfer screenshot in full-resolution lightbox and 1-click approves the transaction.\n'),
              new TextRun('5. Fulfillment: Order status transitions: Pending -> Processing -> Completed upon courier delivery.\n'),
              new TextRun('6. Inventory & Reports: Admin manages product stock (Add, Edit, Delete) and exports sales reports to CSV/Excel in 1 click.\n'),
            ],
          }),

          // ==========================================
          // 4. AI PROMPT LOG
          // ==========================================
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '4. Log Prompting AI (Catatan Prompt & Alur Pengerjaan)',
                bold: true,
                size: 28,
                color: '4338CA',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: '• Session 1 (Project Scoping & Rules): ', bold: true }),
              new TextRun('Formulated .agents/rules/AGENTS.md, defined Supabase free-tier limits, and designed the implementation plan.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: '• Session 2 (Database Schema & Scaffolding): ', bold: true }),
              new TextRun('Bootstrapped Next.js App Router, created supabase/schema.sql with RLS, and wrote initial PRD/ERD.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: '• Session 3 (Full-Stack Implementation): ', bold: true }),
              new TextRun('Built multi-product cart drawer, storefront product catalog, guest checkout, and real-time WebSocket dashboard with Recharts analytics.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: '• Session 4 (Database Sync & Verification): ', bold: true }),
              new TextRun('Verified real-time broadcast and fixed RLS SELECT policies for permanent order persistence across page reloads.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: '• Session 5 (Modern UI/UX & Tax Invoicing): ', bold: true }),
              new TextRun('Eliminated window.confirm() in favor of custom glassmorphism modal dialogs, built dedicated /invoice/[id] corporate tax invoice route with QR code, and added 1-click CSV export.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: '• Session 6 (Logistics & 2.5% Admin Fee Engine): ', bold: true }),
              new TextRun('Built MapLocationPicker with GPS and OpenStreetMap, multi-courier matrix (JNE, J&T, SPX, SiCepat, Instant), 2.5% admin fee arithmetic, and payment proof receipt screenshot uploader.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: '• Session 7 (Cross-Browser Polish & Seeder): ', bold: true }),
              new TextRun('Added cross-browser styling (Chrome, Edge, Safari, Firefox), sleek dark scrollbars, backdrop blur fallbacks, and 1-click interactive database seeder.'),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: '• Session 8 (Single-Merchant Architecture & Final Submission): ', bold: true }),
              new TextRun('Streamlined architecture to pure single-merchant operations, removed registration confusion, added QRIS screenshot proof verification, created database reset script, and compiled Word/PDF documentation.'),
            ],
          }),

          // ==========================================
          // 5. SCREENSHOTS & USER DOCUMENTATION
          // ==========================================
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '5. UI Screenshots & Visual User Documentation (Non-Teknis)',
                bold: true,
                size: 28,
                color: '4338CA',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun(
                'Below are the visual walkthrough captures and non-technical explanations of all core user flows:'
              ),
            ],
          }),

          // Screenshot 1
          new Paragraph({
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: '5.1 Storefront Homepage (Public Catalog & Search)',
                bold: true,
                size: 22,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                'The public storefront displays high-resolution product photography, live pricing in Indonesian Rupiah (IDR), stock availability badges, search bar, and category filters (Electronics, Audio, Wearables, Accessories, Lifestyle).'
              ),
            ],
          }),
          ...embedImage('01_storefront_homepage.png', 480, 260),

          // Screenshot 2
          new Paragraph({
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: '5.2 Product Catalog Grid & Quantity Adjusters',
                bold: true,
                size: 22,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Interactive product cards with instant quantity selectors and "Add to Cart" triggers providing immediate feedback.'
              ),
            ],
          }),
          ...embedImage('02_product_catalog.png', 480, 260),

          // Screenshot 3
          new Paragraph({
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: '5.3 Slide-Over Multi-Product Cart Drawer',
                bold: true,
                size: 22,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                'The slide-over cart drawer allows customers to manage multiple different products, view subtotal calculations, and proceed directly to guest checkout.'
              ),
            ],
          }),
          ...embedImage('03_cart_drawer.png', 480, 260),

          // Screenshot 4
          new Paragraph({
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: '5.4 Express Guest Checkout Form & Map Geolocation',
                bold: true,
                size: 22,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Frictionless guest checkout requiring zero login. Integrates OpenStreetMap GPS pinning, dynamic multi-courier selection, automatic 2.5% administrative fee calculation, and QRIS / Bank Transfer receipt screenshot uploader.'
              ),
            ],
          }),
          ...embedImage('04_guest_checkout_form.png', 480, 260),

          // Screenshot 5
          new Paragraph({
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: '5.5 Order Confirmation & Confetti Celebration',
                bold: true,
                size: 22,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Celebratory order confirmation featuring a unique UUID, itemized receipt, and direct links to view the corporate tax invoice.'
              ),
            ],
          }),
          ...embedImage('05_order_success_receipt.png', 480, 260),

          // Screenshot 6
          new Paragraph({
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: '5.6 Real-Time Admin Operations Dashboard',
                bold: true,
                size: 22,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Operations command center featuring live KPI summary cards (Total Revenue, Order Count, Completed vs. Pending rates, AOV), visual Recharts revenue streams, and status donut charts.'
              ),
            ],
          }),
          ...embedImage('06_admin_dashboard_overview.png', 480, 260),

          // Screenshot 7
          new Paragraph({
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: '5.7 Live WebSocket Real-Time Push Notification',
                bold: true,
                size: 22,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Instant push notification toast banner highlighting live incoming orders via Supabase PostgreSQL WebSockets without requiring a page refresh.'
              ),
            ],
          }),
          ...embedImage('07_realtime_websocket_alert.png', 480, 260),

          // Screenshot 8
          new Paragraph({
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: '5.8 Live Orders Management Table & Courier Badges',
                bold: true,
                size: 22,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Orders table with status dropdown switchers, search query filters, courier logistics badges, payment proof inspection triggers, and 1-click CSV export.'
              ),
            ],
          }),
          ...embedImage('08_admin_orders_management_table.png', 480, 260),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '..', 'docs', 'User Documentation-Azmi.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('🎉 Clean, valid Word .docx generated successfully at:', outputPath);
}

generateDocx().catch(console.error);
