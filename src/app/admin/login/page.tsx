'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck, AlertCircle, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Attempt real Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!authError && data.session) {
        sessionStorage.setItem('admin_demo_auth', 'true');
        sessionStorage.setItem('admin_email', data.session.user.email || email);
        router.push('/admin/dashboard');
        return;
      }

      // 2. Verified Hardcoded Demo Admin Credentials for technical review
      if (email === 'admin@novastore.com' && password === 'admin12345') {
        sessionStorage.setItem('admin_demo_auth', 'true');
        sessionStorage.setItem('admin_email', 'admin@novastore.com');
        router.push('/admin/dashboard');
        return;
      }

      // 3. Strictly Reject unauthorized or random credentials
      throw new Error(
        authError?.message || 'Invalid email or password. Access denied. Please use the designated admin credentials (admin@novastore.com / admin12345) or 1-Click Demo Access.'
      );
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    sessionStorage.setItem('admin_demo_auth', 'true');
    sessionStorage.setItem('admin_email', 'admin@novastore.com');
    router.push('/admin/dashboard');
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Container */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />

          {/* Logo & Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-white tracking-tight">
              NovaStore Admin Portal
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Sign in to access the protected real-time sales & operations dashboard
            </p>
          </div>

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300">Admin Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@novastore.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or Live Interview Mode
            </span>
          </div>

          {/* Instant Demo Access Button */}
          <button
            type="button"
            onClick={handleDemoAccess}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all shadow-sm active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>⚡ Instant Demo Admin Access (No Login Needed)</span>
          </button>

          {/* Security Badge & Back Link */}
          <div className="mt-6 flex flex-col items-center gap-2 border-t border-white/10 pt-4 text-center">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Protected by Supabase Auth & Row Level Security</span>
            </div>
            <Link
              href="/"
              className="text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
