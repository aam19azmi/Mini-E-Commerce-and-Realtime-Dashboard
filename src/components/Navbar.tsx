'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, LayoutDashboard, Store, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              NovaStore
            </span>
            <span className="ml-1.5 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/30">
              Live
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/"
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
              pathname === '/' || pathname.startsWith('/checkout') || pathname.startsWith('/order-success')
                ? 'bg-white/10 text-white shadow-inner'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Storefront</span>
          </Link>

          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
              isAdmin
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-inner'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Live Dashboard</span>
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </Link>
        </nav>

        {/* Cart Drawer Trigger */}
        {!isAdmin && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:from-indigo-500 hover:to-indigo-600 hover:scale-105 active:scale-95"
              id="cart-drawer-button"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-xs font-bold text-slate-950 shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
