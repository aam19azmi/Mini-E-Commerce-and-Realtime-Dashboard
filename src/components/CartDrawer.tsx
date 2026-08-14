'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, clearCart } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-white/10 bg-slate-900 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Your Shopping Cart</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500 mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-base font-semibold text-white">Your cart is empty</h3>
                <p className="mt-1 text-xs text-slate-400 max-w-xs">
                  Looks like you haven't added any products yet. Browse our store to discover great items!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 rounded-xl border border-white/5 bg-slate-800/50 p-3.5 backdrop-blur-sm transition-all hover:border-white/10"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800 border border-white/10">
                    <Image
                      src={item.product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-cyan-400 mt-0.5">
                        {formatPrice(Number(item.product.price))}
                      </p>
                    </div>

                    {/* Stepper & Line Total */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-lg border border-white/10 bg-slate-900/80 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.product.stock > 0 && item.quantity >= item.product.stock}
                          className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-xs font-medium text-slate-300">
                        {formatPrice(Number(item.product.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="border-t border-white/10 bg-slate-950/60 p-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-base font-bold text-white">{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Taxes and shipping calculated at checkout. Instant guest order processing.
              </p>

              <div className="flex flex-col gap-2.5">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
                >
                  <span>Proceed to Guest Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  onClick={clearCart}
                  className="text-center text-xs text-slate-400 hover:text-rose-400 transition-colors py-1"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
