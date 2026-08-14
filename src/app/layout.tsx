import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NovaStore | Mini E-Commerce & Real-time Admin Dashboard',
  description:
    'Experience seamless guest checkout and real-time administrative sales monitoring powered by Next.js and Supabase.',
  keywords: ['e-commerce', 'realtime dashboard', 'guest checkout', 'supabase', 'nextjs'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full bg-slate-950 text-slate-100">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-950 selection:bg-indigo-500 selection:text-white`}>
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
