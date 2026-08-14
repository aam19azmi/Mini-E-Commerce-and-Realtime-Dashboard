'use client';

import React, { useEffect, useState } from 'react';
import { supabase, Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { Search, Sparkles, ShieldCheck, Zap, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Fallback seed items in case Supabase is not yet populated
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'f1e7a1b0-1111-4444-9999-000000000001',
    name: 'Ergonomic Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with hot-swappable switches and wireless connectivity.',
    price: 850000,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
  },
  {
    id: 'f1e7a1b0-2222-4444-9999-000000000002',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear headphones with 40-hour battery life and spatial audio support.',
    price: 1250000,
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    category: 'Audio',
  },
  {
    id: 'f1e7a1b0-3333-4444-9999-000000000003',
    name: 'Smart Fitness Watch Ultra',
    description: 'AMOLED display, heart rate & SpO2 tracking, 5ATM water resistance with GPS.',
    price: 650000,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    category: 'Wearables',
  },
  {
    id: 'f1e7a1b0-4444-4444-9999-000000000004',
    name: 'Minimalist Leather Laptop Backpack',
    description: 'Water-resistant canvas and genuine leather backpack fitting up to 16-inch laptops.',
    price: 450000,
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
  },
  {
    id: 'f1e7a1b0-5555-4444-9999-000000000005',
    name: 'Precision Wireless Mouse',
    description: 'Ultra-lightweight gaming and productivity mouse with 26,000 DPI sensor.',
    price: 375000,
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
  },
  {
    id: 'f1e7a1b0-6666-4444-9999-000000000006',
    name: 'Insulated Stainless Steel Tumbler 750ml',
    description: 'Keeps beverages ice cold for 24 hours or piping hot for 12 hours.',
    price: 185000,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    category: 'Lifestyle',
  },
];

export default function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
          console.log('Using default seed products fallback.');
          setProducts(FALLBACK_PRODUCTS);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products from Supabase:', err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category || 'General')))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 py-16 sm:py-24">
        {/* Glow Effects */}
        <div className="absolute -top-24 left-1/2 -z-10 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="absolute top-1/2 right-10 -z-10 h-[250px] w-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 shadow-inner backdrop-blur-md mb-6">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Express Guest Checkout • Multi-Product Cart</span>
          </div>

          <h1 className="mx-auto max-w-4xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Next-Gen Gear with <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Instant Ordering</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            Choose your favorite products, add multiple items in one transaction, and checkout with zero account registration needed.
          </p>

          {/* Quick Feature Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-3.5 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>No Login Required</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-3.5 py-2 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Real-time Order Sync</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-3.5 py-2 backdrop-blur-sm">
              <ShoppingBag className="h-4 w-4 text-cyan-400" />
              <span>Multi-Product Cart</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        {/* Controls: Search & Category Pills */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'border border-white/10 bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px] sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl border border-white/5 bg-slate-900/60 p-4"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-white">No products found</h3>
              <p className="mt-1 text-xs text-slate-400">
                Try adjusting your search query or switching categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Admin Demo Callout */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 p-8 sm:p-12">
          <div className="max-w-2xl">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              Live Real-Time Monitoring
            </span>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              Monitor Orders in Real-Time as Customers Checkout
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Every order submitted through guest checkout instantly broadcasts to the Admin Dashboard using Supabase Realtime subscriptions. Open the admin panel to watch live transactions arrive without page reloads!
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:scale-105"
              >
                <span>Open Admin Realtime Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
