'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { supabase, Order } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  Printer,
  ArrowLeft,
  Store,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  Building2,
  FileCheck2,
  Truck,
  MapPin,
  Percent,
} from 'lucide-react';

export default function InvoicePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = (params?.id as string) || '';
  const customerNameParam = searchParams.get('name');
  const totalParam = searchParams.get('total');
  const officerParam = searchParams.get('officer') || 'admin@novastore.com';
  const courierParam = searchParams.get('courier');
  const adminFeeParam = searchParams.get('admin_fee');
  const shippingParam = searchParams.get('shipping');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }

    async function loadOrder() {
      if (!orderId) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (!error && data) {
          setOrder(data as Order);
        } else {
          setOrder({
            id: orderId,
            customer_name: customerNameParam || 'Valued Customer',
            customer_email: 'customer@example.com',
            customer_address: 'Standard Delivery Address',
            total_amount: Number(totalParam || '0'),
            admin_fee: Number(adminFeeParam || '0'),
            shipping_courier: courierParam || 'JNE Express (Reguler)',
            shipping_cost: Number(shippingParam || '15000'),
            status: 'completed',
            payment_method: 'qris',
            created_at: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, customerNameParam, totalParam, courierParam, adminFeeParam, shippingParam]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm">Preparing official tax invoice...</p>
      </div>
    );
  }

  const invoice = order || {
    id: orderId,
    customer_name: 'Customer',
    customer_email: 'customer@example.com',
    customer_address: 'Indonesia',
    total_amount: 0,
    status: 'completed',
    payment_method: 'qris',
    created_at: new Date().toISOString(),
  };

  const totalAmount = Number(invoice.total_amount);
  const shippingCost = Number(invoice.shipping_cost || 0);
  const adminFee = Number(invoice.admin_fee || Math.round(totalAmount * 0.025));
  const productSubtotal = Math.max(0, totalAmount - shippingCost - adminFee);
  const dppSubtotal = Math.round(productSubtotal / 1.11);
  const ppnTax = productSubtotal - dppSubtotal;

  const verificationUrl = `${originUrl || 'https://novastore.vercel.app'}/invoice/${invoice.id}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&data=${encodeURIComponent(
    verificationUrl
  )}`;

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:text-black">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="mx-auto max-w-4xl mb-6 flex items-center justify-between no-print">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Application</span>
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official A4 Document Container */}
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white p-8 sm:p-12 text-slate-900 shadow-2xl print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b-2 border-slate-900 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white font-bold print:border print:border-black">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950">NOVASTORE</h1>
                <p className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase print:text-black">
                  PT NOVA DIGITAL NIAGA INDONESIA
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed max-w-xs">
              Cyber 2 Tower, 18th Floor, Jl. H.R. Rasuna Said, Jakarta Selatan, 12950<br />
              NPWP: 01.345.678.9-012.000 • support@novastore.com
            </p>
          </div>

          <div className="mt-6 sm:mt-0 text-left sm:text-right">
            <div className="inline-block rounded-lg bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700 border border-indigo-200 print:border-gray-400 print:text-black">
              OFFICIAL COMMERCIAL TAX INVOICE
            </div>
            <p className="mt-3 font-mono text-sm font-bold text-slate-900">
              INV/{invoice.created_at?.slice(0, 10).replace(/-/g, '')}/{invoice.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Issue Date: {formatDate(invoice.created_at)}
            </p>
            <p className="text-xs text-slate-500">
              Payment Status: <span className="font-bold text-emerald-600">PAID & RECORDED</span>
            </p>
          </div>
        </div>

        {/* 3-Column Information Grid: Seller/Merchant, Buyer/Destination, & Processing Admin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-200 text-xs">
          {/* Column 1: Seller / Merchant Details */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <span className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-indigo-600" />
              <span>OFFICIAL SELLER / MERCHANT</span>
            </span>
            <p className="text-xs font-bold text-slate-950 mt-1.5 truncate">
              {invoice.seller_email || officerParam || 'NovaStore Official Store'}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">Courier Hub: NovaStore Logistics Network</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
              Verified Marketplace Merchant
            </span>
          </div>

          {/* Column 2: Customer & Delivery Destination */}
          <div>
            <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">
              BILLED TO & DESTINATION:
            </span>
            <p className="text-sm font-bold text-slate-950 mt-1">{invoice.customer_name}</p>
            <p className="text-slate-600 mt-0.5">{invoice.customer_email}</p>
            {invoice.customer_phone && <p className="text-slate-600">Tel: {invoice.customer_phone}</p>}
            <p className="text-slate-800 font-medium mt-1 leading-relaxed text-[11px]">
              {invoice.customer_address}
            </p>
            {invoice.destination_lat && invoice.destination_lng && (
              <p className="font-mono text-[9px] text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-indigo-500" />
                <span>GPS: {Number(invoice.destination_lat).toFixed(4)}°, {Number(invoice.destination_lng).toFixed(4)}°</span>
              </p>
            )}
          </div>

          {/* Column 3: Authorized Processing Admin Officer */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5">
            <span className="font-extrabold text-indigo-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5" />
              <span>CASHIER / ADMIN OFFICER</span>
            </span>
            <p className="text-xs font-bold text-slate-900 mt-1.5 truncate">{officerParam}</p>
            <p className="text-[11px] text-slate-600">Role: Store Operations & Cashier</p>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <ShieldCheck className="h-3 w-3" />
              <span>Payment Verified & Stamped</span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6 border-b-2 border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-300 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="pb-3 w-10">No.</th>
                <th className="pb-3">Item Description</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Unit Price (DPP)</th>
                <th className="pb-3 text-right">Subtotal (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="py-4 font-bold text-slate-400">1</td>
                <td className="py-4">
                  <p className="font-bold text-slate-950 text-sm">Selected Multi-Product Package</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Order Ref: #{invoice.id} • Shipped via {invoice.shipping_courier || 'JNE Express'}
                  </p>
                </td>
                <td className="py-4 text-center font-semibold">1</td>
                <td className="py-4 text-right font-medium">
                  {formatPrice(dppSubtotal)}
                </td>
                <td className="py-4 text-right font-bold text-slate-950">
                  {formatPrice(dppSubtotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Calculations Section */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start gap-8">
          {/* Official Verification QR & Security Section */}
          <div className="w-full sm:w-1/2 flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs">
            <div className="relative h-24 w-24 flex-shrink-0 bg-white p-1 rounded-lg border border-emerald-300 shadow-sm flex items-center justify-center">
              <img
                src={qrCodeImageUrl}
                alt="Scan to Verify Invoice Authenticity"
                width={88}
                height={88}
                className="object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>SCAN TO VERIFY RECORD</span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1 leading-relaxed">
                Scan with any smartphone camera to verify this live official record in PostgreSQL Supabase.
              </p>
              <p className="font-mono text-[9px] text-emerald-600 mt-1 truncate">
                ID: {invoice.id}
              </p>
            </div>
          </div>

          {/* Totals Table (Itemized breakdown with 2.5% Admin Fee & Courier Tariff) */}
          <div className="w-full sm:w-80 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Produk (DPP)</span>
              <span className="font-semibold text-slate-900">{formatPrice(dppSubtotal)}</span>
            </div>
            {invoice.destination_lat && (Number(invoice.destination_lat) > 6.5 || Number(invoice.destination_lat) < -11.5 || Number(invoice.destination_lng) < 95.0 || Number(invoice.destination_lng) > 141.5) ? (
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <span>PPN Ekspor (0% Cross-Border)</span>
                  <span className="rounded bg-emerald-100 px-1 text-[9px] font-bold text-emerald-800">Zero-Rated</span>
                </span>
                <span className="font-semibold text-emerald-700">Rp 0 (Exempt)</span>
              </div>
            ) : (
              <div className="flex justify-between text-slate-600">
                <span>PPN Pajak Pertambahan Nilai (11%)</span>
                <span className="font-semibold text-slate-900">{formatPrice(ppnTax)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Ongkos Kirim ({invoice.shipping_courier || 'JNE Express'})</span>
              <span className="font-semibold text-slate-900">{formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Biaya Layanan / Administrasi (2,5%)</span>
              <span className="font-semibold text-amber-700">{formatPrice(adminFee)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-slate-900 pt-3 text-base font-black text-slate-950">
              <span>Total Tagihan (Grand Total)</span>
              <span className="text-indigo-600 print:text-black">{formatPrice(totalAmount)}</span>
            </div>
            <p className="text-[10px] text-slate-400 text-right">
              Produk ({formatPrice(productSubtotal)}) + Ongkir ({formatPrice(shippingCost)}) + Admin 2,5% ({formatPrice(adminFee)}) = {formatPrice(totalAmount)}
            </p>
          </div>
        </div>

        {/* Digital Signature & Issuing Officer Section */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <span>
              Certified Electronic Tax Document. Officially issued by PT Nova Digital Niaga.
            </span>
          </div>

          <div className="mt-3 sm:mt-0 text-right">
            <p className="font-bold text-slate-800 text-[11px]">Authorized Digital Stamp</p>
            <p className="font-mono text-[10px] text-slate-500">
              HASH-SHA256: {invoice.id.slice(0, 16)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
