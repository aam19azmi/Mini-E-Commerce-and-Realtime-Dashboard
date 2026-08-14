'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Check, Plus, Minus, Package, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Check how many of this item is already in cart
  const currentInCart = cart.find((item) => item.product.id === product.id)?.quantity || 0;
  const isOutOfStock = product.stock <= 0;
  const isMaxStock = currentInCart + quantity > product.stock;

  const handleAdd = () => {
    if (isOutOfStock || isMaxStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleIncrease = () => {
    if (currentInCart + quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800">
        <Image
          src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        
        {/* Category Pill */}
        <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/20 backdrop-blur-md">
          {product.category || 'Tech'}
        </span>

        {/* Stock Badge */}
        <div className="absolute right-3 top-3">
          {isOutOfStock ? (
            <span className="flex items-center gap-1 rounded-full bg-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-300 border border-rose-500/30 backdrop-blur-md">
              <AlertCircle className="h-3 w-3" /> Out of stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30 backdrop-blur-md">
              <AlertCircle className="h-3 w-3" /> Only {product.stock} left
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <Package className="h-3 w-3" /> {product.stock} in stock
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Merchant / Seller Tag */}
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-indigo-400 font-medium">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
          <span className="truncate">Merchant: {product.seller_name || product.seller_email || 'NovaStore Official'}</span>
        </div>

        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Actions */}
        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 font-medium">Price</span>
            <span className="text-lg font-bold text-cyan-400 tracking-tight">
              {formatPrice(Number(product.price))}
            </span>
          </div>

          {/* Stepper & Add to Cart Controls */}
          <div className="mt-3.5 flex items-center gap-2">
            {/* Quantity Stepper */}
            <div className="flex items-center rounded-xl border border-white/10 bg-slate-800/80 p-1">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1 || isOutOfStock}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-white">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                disabled={isOutOfStock || currentInCart + quantity >= product.stock}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              disabled={isOutOfStock || isMaxStock}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-md transition-all duration-200 ${
                added
                  ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                  : isOutOfStock || isMaxStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
