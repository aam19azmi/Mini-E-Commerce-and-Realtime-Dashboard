'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl text-slate-400 text-xs">
      {/* Top Value Propositions */}
      <div className="border-b border-white/5 bg-slate-900/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-white/5 bg-slate-800/20">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Domestic & Global Shipping</h4>
                <p className="text-[11px] text-slate-400">JNE, J&T, SiCepat, DHL & FedEx Worldwide</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-white/5 bg-slate-800/20">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">100% Authentic Guarantee</h4>
                <p className="text-[11px] text-slate-400">Official distributor warranty on all items</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-white/5 bg-slate-800/20">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">7-Day Easy Return Policy</h4>
                <p className="text-[11px] text-slate-400">Return goods first &rarr; Inspection &rarr; Full refund</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-white/5 bg-slate-800/20">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Instant Zero-Fee Checkout</h4>
                <p className="text-[11px] text-slate-400">Instant QRIS, Direct Bank Transfer & COD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Store className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white">
                  Nova<span className="text-cyan-400">Store</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400">
                  Digital Commerce Platform
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              NovaStore is Indonesia&apos;s premier high-performance digital electronics store. Designed with instant guest checkout, dynamic multi-courier routing, and real-time inventory management.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 space-y-1.5 border-t border-white/5">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>PT Nova Digital Mandiri Nusantara</span>
              </div>
              <p className="text-slate-500">NIB: 9120301928301 • PKP Registered Corporate Seller</p>
            </div>
          </div>

          {/* Col 2: Store Headquarters & Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Headquarters & Hub
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said Blok X-5 No. 13, Kuningan Timur, Setiabudi, Jakarta Selatan, DKI Jakarta 12950
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                <span>Mon – Sat: 08:00 – 21:00 WIB</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Same-day dispatch for orders before 15:00 WIB</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Returns Policy (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Support & Return SOP
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                <span className="text-white font-medium">+62 812-9876-5432 (WhatsApp/Call)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                <span className="text-slate-300">support@novastore.com</span>
              </li>
            </ul>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3 space-y-1.5 text-[11px]">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <RotateCcw className="h-3 w-3" />
                <span>How Returns & Refunds Work:</span>
              </div>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-400 text-[10.5px]">
                <li>Customer ships the item back to our Jakarta hub first.</li>
                <li>Warehouse inspects goods condition & serial tags.</li>
                <li>Order marked as Cancelled &rarr; stock auto-restores.</li>
                <li>100% full payment refund transferred within 24 hours.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Partners & Payment Method Badges */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-[11px] font-bold text-slate-400 mr-2">Official Logistics:</span>
            <span className="rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-300">JNE Express</span>
            <span className="rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-300">J&amp;T Express</span>
            <span className="rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-300">SiCepat</span>
            <span className="rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-300">Shopee Xpress</span>
            <span className="rounded-md border border-indigo-500/30 bg-indigo-950/40 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">DHL Express</span>
            <span className="rounded-md border border-indigo-500/30 bg-indigo-950/40 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">FedEx Global</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
            <span className="text-[11px] font-bold text-slate-400 mr-2">Payment Channels:</span>
            <span className="rounded-md border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300">QRIS Instant</span>
            <span className="rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-300">BCA Transfer</span>
            <span className="rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-300">Bank Mandiri</span>
            <span className="rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-300">Cash on Delivery</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} NovaStore. Built for Technical Interview Assessment by Azmi Jalaluddin Amron.</p>
          <div className="flex items-center gap-4">
            <span>Next.js 16 (App Router)</span>
            <span>•</span>
            <span>Supabase PostgreSQL Realtime</span>
            <span>•</span>
            <span>Vercel Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
