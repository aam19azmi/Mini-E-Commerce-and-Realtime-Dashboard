import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISAHBLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Key is missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  seller_email?: string;
  seller_name?: string;
  created_at?: string;
};

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type CourierService = {
  id: string;
  name: string;
  service: string;
  eta: string;
  baseRate: number;
  perKmRate: number;
  icon: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address: string;
  total_amount: number;
  admin_fee?: number;
  shipping_courier?: string;
  shipping_cost?: number;
  destination_lat?: number;
  destination_lng?: number;
  payment_proof_url?: string;
  payment_verified?: boolean;
  seller_qris_url?: string;
  seller_bank_info?: string;
  status: OrderStatus;
  payment_method: string;
  seller_email?: string;
  created_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id?: string;
  order_id?: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: Product;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
