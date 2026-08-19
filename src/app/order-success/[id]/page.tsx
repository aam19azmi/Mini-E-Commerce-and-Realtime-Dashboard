'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { supabase, OrderItem } from '@/lib/supabase';
import { DEFAULT_CATALOG_PRODUCTS, DEFAULT_STARTER_ORDERS } from '@/lib/defaultCatalog';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Copy,
  Check,
  Printer,
  FileCheck,
  ShieldCheck,
  Store,
  Truck,
  Percent,
  Package,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = (params?.id as string) || 'ORD-999999';
  const customerName = searchParams.get('name') || 'Valued Customer';
  const totalAmount = Number(searchParams.get('total') || '0');
  const courierName = searchParams.get('courier') || 'JNE Express';
  const adminFee = Number(searchParams.get('admin_fee') || '0');
  const shippingCost = Number(searchParams.get('shipping') || '0');
  const productSubtotal = Math.max(0, totalAmount - shippingCost - adminFee);

  const [copied, setCopied] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );

    // Fire celebratory confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#6366f1', '#06b6d4', '#10b981'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#6366f1', '#06b6d4', '#10b981'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    async function loadOrderItems() {
      if (!orderId) return;
      try {
        const { data, error } = await supabase
          .from('order_items')
          .select('*, product:products(*)')
          .eq('order_id', orderId);

        if (!error && data && data.length > 0) {
          const enriched = data.map((it: any) => ({
            ...it,
            product:
              it.product ||
              DEFAULT_CATALOG_PRODUCTS.find((p) => p.id === it.product_id),
          }));
          setOrderItems(enriched as OrderItem[]);
        } else {
          const starterMatch = DEFAULT_STARTER_ORDERS.find((o) => o.id === orderId);
          if (starterMatch?.order_items && starterMatch.order_items.length > 0) {
            const enriched = starterMatch.order_items.map((it) => ({
              ...it,
              product:
                it.product ||
                DEFAULT_CATALOG_PRODUCTS.find((p) => p.id === it.product_id),
            }));
            setOrderItems(enriched as OrderItem[]);
          }
        }
      } catch (err) {
        console.error('Error fetching items for order-success:', err);
      } finally {
        setLoadingItems(false);
      }
    }

    loadOrderItems();
  }, [orderId]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    router.push(
      `/invoice/${orderId}?name=${encodeURIComponent(customerName)}&total=${totalAmount}&courier=${encodeURIComponent(
        courierName
      )}&admin_fee=${adminFee}&shipping=${shippingCost}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:text-black">
      <div className="mx-auto max-w-3xl">
        {/* On-Screen Celebration Header */}
        <div className="text-center mb-8 print:hidden">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" /> Order Successfully Placed!
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
            Thank you, {customerName}!
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Your guest order has been recorded and synced to the real-time fulfillment dashboard.
          </p>
        </div>

        {/* Professional Printable Receipt Container */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl print:border-none print:shadow-none print:bg-white print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-8 print:border-gray-300">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white print:text-black">NOVASTORE</h2>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 print:text-gray-600">
                  PT NOVA DIGITAL NIAGA INDONESIA
                </p>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 text-left sm:text-right">
              <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20 print:border-none print:text-black">
                PAID & RECORDED
              </span>
              <p className="text-xs text-slate-400 mt-1 print:text-gray-600">Date: {currentDate}</p>
            </div>
          </div>

          {/* Reference & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-white/10 text-xs print:border-gray-200">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] print:text-gray-500">
                Customer Recipient:
              </span>
              <p className="text-sm font-bold text-white mt-1 print:text-black">{customerName}</p>
              <p className="text-slate-400 print:text-gray-600">Guest Order Transaction</p>
            </div>

            <div className="sm:text-right">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] print:text-gray-500">
                Order Tracking ID:
              </span>
              <div className="flex items-center sm:justify-end gap-2 mt-1">
                <code className="rounded-lg bg-slate-800 px-2 py-1 font-mono text-xs font-bold text-cyan-300 border border-white/10 print:bg-gray-100 print:text-black print:border-gray-300">
                  {orderId}
                </code>
                <button
                  onClick={handleCopyId}
                  className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors print:hidden"
                  title="Copy ID"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Shipping & Handling */}
          <div className="py-4 border-b border-white/10 flex items-center justify-between text-xs print:border-gray-200">
            <div className="flex items-center gap-2 text-slate-300 print:text-gray-700">
              <Truck className="h-4 w-4 text-indigo-400" />
              <span>Courier Service: <strong>{courierName}</strong></span>
            </div>
            <span className="font-semibold text-cyan-400 print:text-black">{formatPrice(shippingCost)}</span>
          </div>

          {/* Itemized Order Products Breakdown */}
          {orderItems.length > 0 && (
            <div className="py-4 border-b border-white/10 space-y-3 print:border-gray-200">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-indigo-400 print:text-black" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-700">
                  Purchased Items ({orderItems.length})
                </span>
              </div>
              <div className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-slate-800/30 overflow-hidden print:border-gray-200 print:bg-white print:divide-gray-200">
                {orderItems.map((item, idx) => {
                  const prodName = item.product?.name || `Product Item #${idx + 1}`;
                  const prodImg =
                    item.product?.image_url ||
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
                  const prodCategory = item.product?.category || 'General';
                  const qty = item.quantity || 1;
                  const unitPrice = Number(item.unit_price || 0);
                  const subtotal = Number(item.subtotal || unitPrice * qty);

                  return (
                    <div
                      key={item.id || idx}
                      className="flex items-center justify-between p-3 gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {prodImg && (
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-900 print:border-gray-300">
                            <img
                              src={prodImg}
                              alt={prodName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-white print:text-black truncate">{prodName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-indigo-300 print:bg-gray-100 print:text-black">
                              {prodCategory}
                            </span>
                            <span className="text-[11px] text-slate-400 print:text-gray-600">
                              Qty: <strong className="text-cyan-300 print:text-black font-bold">{qty}</strong> × {formatPrice(unitPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-cyan-400 print:text-black flex-shrink-0">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calculations Summary */}
          <div className="pt-6 flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs print:text-black">
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Product Subtotal</span>
                <span className="font-semibold text-white print:text-black">
                  {formatPrice(productSubtotal > 0 ? productSubtotal : totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Courier Shipping</span>
                <span className="font-semibold text-cyan-400 print:text-black">{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Biaya Layanan / Admin (2.5%)</span>
                <span className="font-semibold text-amber-300 print:text-black">{formatPrice(adminFee)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-sm font-bold text-white print:border-gray-400 print:text-black">
                <span>Grand Total</span>
                <span className="text-base text-cyan-400 print:text-black">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Security & Authenticity Stamp */}
          <div className="mt-8 rounded-2xl border border-white/5 bg-slate-800/40 p-4 flex items-center justify-between text-xs print:bg-gray-50 print:border-gray-200">
            <div className="flex items-center gap-2 text-slate-300 print:text-gray-700">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Verified digital receipt synchronized with NovaStore PostgreSQL.</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 print:text-gray-500">
              SEC-ID: {orderId.slice(0, 10)}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>View & Print Official Tax Invoice</span>
          </button>

          <Link
            href="/admin/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-6 py-3.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-md"
          >
            <LayoutDashboard className="h-4 w-4 text-cyan-400" />
            <span>Open Real-time Dashboard</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-6 py-3.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-md"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Shop More Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
