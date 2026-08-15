'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase, Order, OrderStatus, Product } from '@/lib/supabase';
import { formatPrice, formatDate, STATUS_COLORS } from '@/lib/utils';
import {
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Radio,
  Search,
  RefreshCw,
  Eye,
  TrendingUp,
  Sparkles,
  Package,
  PlusCircle,
  X,
  User,
  MapPin,
  Mail,
  Phone,
  Download,
  Printer,
  Edit,
  Trash2,
  Plus,
  Layers,
  Save,
  ShieldAlert,
  Store,
  FileCheck,
  ShieldCheck,
  LogOut,
  Truck,
  Building2,
  QrCode,
  Paperclip,
  Check,
  Database,
  Globe,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-8831a-001',
    customer_name: 'Budi Pratama',
    customer_email: 'budi.p@example.com',
    customer_phone: '081298765432',
    customer_address: 'Jl. Sudirman No. 45, Jakarta Pusat 10220',
    total_amount: 2100000,
    shipping_courier: 'JNE Express - Reguler',
    shipping_cost: 15000,
    admin_fee: 52500,
    status: 'completed',
    payment_method: 'bank_transfer',
    payment_verified: true,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'ord-8831a-002',
    customer_name: 'Siti Rahma',
    customer_email: 'siti.rahma@example.com',
    customer_phone: '085712345678',
    customer_address: 'Jl. Dago No. 12, Bandung 40132',
    total_amount: 850000,
    shipping_courier: 'J&T Express - EZ Standard',
    shipping_cost: 18000,
    admin_fee: 21250,
    status: 'processing',
    payment_method: 'qris',
    payment_verified: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ord-8831a-003',
    customer_name: 'Ahmad Fauzi',
    customer_email: 'fauzi.ahmad@example.com',
    customer_phone: '081377889900',
    customer_address: 'Jl. Pemuda No. 88, Surabaya 60271',
    total_amount: 1435000,
    shipping_courier: 'Shopee Xpress (SPX) - Eco',
    shipping_cost: 12000,
    admin_fee: 35875,
    status: 'pending',
    payment_method: 'cash_on_delivery',
    created_at: new Date(Date.now() - 3600000 * 0.5).toISOString(),
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [paymentSettingsOpen, setPaymentSettingsOpen] = useState<boolean>(false);
  const [resetModalOpen, setResetModalOpen] = useState<boolean>(false);
  const [sellerQrisUrl, setSellerQrisUrl] = useState<string>('');
  const [sellerBankInfo, setSellerBankInfo] = useState<string>('BCA: 8831-2941-002 • Mandiri: 120-00-9831-412');

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    category: 'Electronics',
  });

  // Fetch initial orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error on orders:', error.message);
        setOrders(SEED_ORDERS);
      } else if (data) {
        setOrders(data as Order[]);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
      setOrders(SEED_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data as Product[]);
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const [currentAdminEmail, setCurrentAdminEmail] = useState<string>('admin@novastore.com');

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      const isDemo = typeof window !== 'undefined' && sessionStorage.getItem('admin_demo_auth') === 'true';
      if (!data.session && !isDemo) {
        router.replace('/admin/login');
      } else if (data.session?.user?.email) {
        setCurrentAdminEmail(data.session.user.email);
      } else if (isDemo) {
        setCurrentAdminEmail('demo.admin@novastore.com');
      }
    }
    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_demo_auth');
    }
    router.push('/admin/login');
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();

    // Supabase Real-time Subscription on orders
    const channel = supabase
      .channel('realtime_orders_dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;
            setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
            setNewOrderAlert(`🎉 New live order from ${newOrder.customer_name} (${formatPrice(Number(newOrder.total_amount))})`);
            setTimeout(() => setNewOrderAlert(null), 6000);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Order;
            setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as Order;
            setOrders((prev) => prev.filter((o) => o.id !== deleted.id));
          }
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update order status & replenish stock if cancelled
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const currentOrder = orders.find((o) => o.id === orderId);
      const previousStatus = currentOrder?.status;

      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      // Stock Restitution Logic:
      // If changing to 'cancelled', restore product inventory
      if (newStatus === 'cancelled' && previousStatus !== 'cancelled') {
        const { data: items } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', orderId);

        if (items && items.length > 0) {
          for (const item of items) {
            const prod = products.find((p) => p.id === item.product_id);
            if (prod) {
              const restoredStock = Number(prod.stock || 0) + Number(item.quantity || 0);
              await supabase.from('products').update({ stock: restoredStock }).eq('id', item.product_id);
            }
          }
          await fetchProducts();
        }
      } else if (previousStatus === 'cancelled' && newStatus !== 'cancelled') {
        // If un-cancelling an order, re-deduct product inventory
        const { data: items } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', orderId);

        if (items && items.length > 0) {
          for (const item of items) {
            const prod = products.find((p) => p.id === item.product_id);
            if (prod) {
              const reDeductedStock = Math.max(0, Number(prod.stock || 0) - Number(item.quantity || 0));
              await supabase.from('products').update({ stock: reDeductedStock }).eq('id', item.product_id);
            }
          }
          await fetchProducts();
        }
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  // Verify & Approve/Reject uploaded payment proof
  const handleVerifyPayment = async (orderId: string, approved: boolean) => {
    try {
      const newStatus: OrderStatus = approved ? 'processing' : 'cancelled';
      await handleUpdateStatus(orderId, newStatus);
      await supabase
        .from('orders')
        .update({ payment_verified: approved })
        .eq('id', orderId);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus, payment_verified: approved } : o
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus, payment_verified: approved } : null
        );
      }

      setNewOrderAlert(
        approved
          ? '✅ Payment Proof Verified & Approved! Order moved to Processing.'
          : '⚠️ Payment Marked Rejected & Order Cancelled (Stock Restored).'
      );
      setTimeout(() => setNewOrderAlert(null), 5000);
    } catch (e) {
      console.error('Error verifying payment:', e);
    }
  };

  // Simulate a live order for the current seller
  const handleSimulateOrder = async () => {
    const randomNames = ['Dewi Lestari', 'Reza Rahadian', 'Andi Wijaya', 'Maya Putri', 'Eko Prasetyo'];
    const randomCities = ['Jakarta', 'Surabaya', 'Medan', 'Yogyakarta', 'Denpasar'];
    const randomCouriers = ['JNE Express (Reguler)', 'J&T Express (EZ)', 'Shopee Xpress (Eco)', 'SiCepat BEST'];
    const name = randomNames[Math.floor(Math.random() * randomNames.length)];
    const city = randomCities[Math.floor(Math.random() * randomCities.length)];
    const courier = randomCouriers[Math.floor(Math.random() * randomCouriers.length)];
    const subtotal = Math.floor(Math.random() * 10 + 2) * 100000;
    const shipping = 15000;
    const admin = Math.round(subtotal * 0.025);
    const amount = subtotal + shipping + admin;

    const newSimulatedOrder = {
      customer_name: name,
      customer_email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      customer_phone: '08' + Math.floor(1000000000 + Math.random() * 9000000000),
      customer_address: `Jl. Melati No. ${Math.floor(Math.random() * 100)}, ${city}`,
      total_amount: amount,
      shipping_courier: courier,
      shipping_cost: shipping,
      admin_fee: admin,
      status: 'pending' as OrderStatus,
      payment_method: 'qris',
      payment_verified: true,
      seller_email: currentAdminEmail,
    };

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([newSimulatedOrder])
        .select()
        .single();

      if (!error && data) {
        setOrders((prev) => [data as Order, ...prev]);
        setNewOrderAlert(`🎉 Live order received for your store: ${name} (${formatPrice(amount)})`);
        setTimeout(() => setNewOrderAlert(null), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 1-Click Interactive Database Seeder
  const handleSeedDatabase = async () => {
    setLoading(true);
    try {
      const sampleProducts = [
        {
          name: 'Apex Pro RGB Mechanical Keyboard',
          description: 'Aircraft-grade aluminum frame, OmniPoint adjustable switches, and per-key RGB illumination.',
          price: 1850000,
          stock: 35,
          image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
          category: 'Electronics',
          seller_email: currentAdminEmail,
          seller_name: currentAdminEmail.split('@')[0],
        },
        {
          name: 'AeroFit Wireless ANC Headphones',
          description: 'Active Noise Cancellation, 40-hour ultra battery endurance, and hi-res lossless wireless audio.',
          price: 1250000,
          stock: 20,
          image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
          category: 'Audio',
          seller_email: currentAdminEmail,
          seller_name: currentAdminEmail.split('@')[0],
        },
        {
          name: 'Vanguard Smart GPS Fitness Watch',
          description: '1.43" AMOLED Retina display, dual-band GPS, 24/7 heart-rate monitoring, and 5ATM water resistance.',
          price: 850000,
          stock: 45,
          image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
          category: 'Wearables',
          seller_email: currentAdminEmail,
          seller_name: currentAdminEmail.split('@')[0],
        },
        {
          name: 'NovaCraft Leather Executive Backpack',
          description: 'Handcrafted genuine leather and waterproof ballistic canvas tailored for 16-inch laptops.',
          price: 650000,
          stock: 15,
          image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
          category: 'Accessories',
          seller_email: currentAdminEmail,
          seller_name: currentAdminEmail.split('@')[0],
        },
        {
          name: 'Starlight Wireless Precision Mouse',
          description: 'Ultra-lightweight 58g honeycomb frame, 26,000 DPI optical sensor, and zero-latency wireless.',
          price: 495000,
          stock: 50,
          image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
          category: 'Peripherals',
          seller_email: currentAdminEmail,
          seller_name: currentAdminEmail.split('@')[0],
        },
        {
          name: 'HydroShield Vacuum Insulated Tumbler 750ml',
          description: 'Triple-insulated stainless steel keeps cold for 24h and hot for 12h. BPA-free leakproof lid.',
          price: 195000,
          stock: 60,
          image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
          category: 'Lifestyle',
          seller_email: currentAdminEmail,
          seller_name: currentAdminEmail.split('@')[0],
        },
      ];

      const sampleOrders = [
        {
          customer_name: 'Budi Pratama',
          customer_email: 'budi.pratama@example.com',
          customer_phone: '081298765432',
          customer_address: 'Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said, Jakarta Selatan 12950',
          total_amount: 1896250,
          admin_fee: 46250,
          shipping_courier: 'JNE Express - Reguler (REG)',
          shipping_cost: 15000,
          destination_lat: -6.2255,
          destination_lng: 106.8318,
          payment_method: 'qris',
          payment_verified: true,
          status: 'completed' as OrderStatus,
          seller_email: currentAdminEmail,
        },
        {
          customer_name: 'Siti Rahmadani',
          customer_email: 'siti.rahma@example.com',
          customer_phone: '085712345678',
          customer_address: 'Jl. Ir. H. Juanda No. 120, Dago, Bandung, Jawa Barat 40132',
          total_amount: 1301250,
          admin_fee: 31250,
          shipping_courier: 'J&T Express - EZ Standard',
          shipping_cost: 20000,
          destination_lat: -6.885,
          destination_lng: 107.614,
          payment_method: 'bank_transfer',
          payment_verified: true,
          status: 'processing' as OrderStatus,
          seller_email: currentAdminEmail,
        },
        {
          customer_name: 'Andi Wijaya',
          customer_email: 'andi.wijaya@example.com',
          customer_phone: '081377889900',
          customer_address: 'Jl. Pemuda No. 45, Embong Kaliasin, Surabaya, Jawa Timur 60271',
          total_amount: 886250,
          admin_fee: 21250,
          shipping_courier: 'Shopee Xpress (SPX) - Standard Eco',
          shipping_cost: 15000,
          destination_lat: -7.265,
          destination_lng: 112.748,
          payment_method: 'qris',
          payment_verified: true,
          status: 'completed' as OrderStatus,
          seller_email: currentAdminEmail,
        },
      ];

      await supabase.from('products').insert(sampleProducts);
      await supabase.from('orders').insert(sampleOrders);

      await fetchProducts();
      await fetchOrders();

      setNewOrderAlert('🌱 Sample catalog & orders seeded successfully!');
      setTimeout(() => setNewOrderAlert(null), 5000);
    } catch (e) {
      console.error('Seeding error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Export Orders to CSV (seller-scoped)
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Shipping Address',
      'Total Amount (IDR)',
      'Status',
      'Payment Method',
      'Seller Account',
      'Created At',
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.id}"`,
      `"${o.customer_name}"`,
      `"${o.customer_email}"`,
      `"${o.customer_phone || '-'}"`,
      `"${(o.customer_address || '').replace(/"/g, '""')}"`,
      o.total_amount,
      `"${o.status}"`,
      `"${o.payment_method}"`,
      `"${o.seller_email || currentAdminEmail}"`,
      `"${formatDate(o.created_at)}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `novastore_seller_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset Actions:
  // 1. Clear All Orders (Keep Products)
  const handleClearAllOrders = async () => {
    setLoading(true);
    try {
      await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      setOrders([]);
      setResetModalOpen(false);
      setNewOrderAlert('🧹 All test orders cleared! Ready for live order simulations.');
      setTimeout(() => setNewOrderAlert(null), 5000);
    } catch (err) {
      console.error('Failed to clear orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Complete Database Reset (Default Flagship Catalog & Starter Demo Orders)
  const handleResetPristineDefault = async () => {
    setLoading(true);
    try {
      await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const pristineProducts = [
        {
          name: 'Apex Pro RGB Mechanical Keyboard',
          description: 'Aircraft-grade aluminum frame, OmniPoint adjustable switches, and per-key RGB illumination with USB passthrough.',
          price: 1850000,
          stock: 35,
          image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
          category: 'Electronics',
        },
        {
          name: 'AeroFit Wireless ANC Headphones',
          description: 'Active Noise Cancellation, 40-hour ultra battery endurance, and hi-res lossless spatial audio.',
          price: 1250000,
          stock: 20,
          image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
          category: 'Audio',
        },
        {
          name: 'Vanguard Smart GPS Fitness Watch',
          description: '1.43" AMOLED Retina display, dual-band GPS, 24/7 heart-rate monitoring, and 5ATM water resistance.',
          price: 850000,
          stock: 45,
          image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
          category: 'Wearables',
        },
        {
          name: 'NovaCraft Leather Executive Backpack',
          description: 'Handcrafted genuine leather and waterproof ballistic canvas tailored for up to 16-inch laptops.',
          price: 650000,
          stock: 15,
          image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
          category: 'Accessories',
        },
        {
          name: 'Starlight Wireless Precision Mouse',
          description: 'Ultra-lightweight 58g frame, 26,000 DPI optical sensor, and zero-latency wireless connectivity.',
          price: 495000,
          stock: 50,
          image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
          category: 'Peripherals',
        },
        {
          name: 'HydroShield Vacuum Insulated Tumbler 750ml',
          description: 'Triple-insulated stainless steel keeps cold for 24 hours and hot for 12 hours. BPA-free leakproof lid.',
          price: 195000,
          stock: 60,
          image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
          category: 'Lifestyle',
        },
      ];

      const pristineOrders = [
        {
          customer_name: 'Budi Pratama',
          customer_email: 'budi.pratama@example.com',
          customer_phone: '081298765432',
          customer_address: 'Cyber 2 Tower Lt. 18, Jl. H.R. Rasuna Said, Jakarta Selatan 12950',
          total_amount: 1896250,
          admin_fee: 46250,
          shipping_courier: 'JNE Express - Reguler (REG)',
          shipping_cost: 15000,
          destination_lat: -6.2255,
          destination_lng: 106.8318,
          payment_method: 'qris',
          payment_verified: true,
          status: 'completed' as OrderStatus,
        },
        {
          customer_name: 'Siti Rahmadani',
          customer_email: 'siti.rahma@example.com',
          customer_phone: '085712345678',
          customer_address: 'Jl. Ir. H. Juanda No. 120, Dago, Bandung, Jawa Barat 40132',
          total_amount: 1301250,
          admin_fee: 31250,
          shipping_courier: 'J&T Express - EZ Standard',
          shipping_cost: 20000,
          destination_lat: -6.885,
          destination_lng: 107.614,
          payment_method: 'bank_transfer',
          payment_verified: true,
          status: 'processing' as OrderStatus,
        },
        {
          customer_name: 'Andi Wijaya',
          customer_email: 'andi.wijaya@example.com',
          customer_phone: '081377889900',
          customer_address: 'Jl. Pemuda No. 45, Embong Kaliasin, Surabaya, Jawa Timur 60271',
          total_amount: 886250,
          admin_fee: 21250,
          shipping_courier: 'Shopee Xpress (SPX) - Standard Eco',
          shipping_cost: 15000,
          destination_lat: -7.265,
          destination_lng: 112.748,
          payment_method: 'qris',
          payment_verified: true,
          status: 'completed' as OrderStatus,
        },
      ];

      await supabase.from('products').insert(pristineProducts);
      await supabase.from('orders').insert(pristineOrders);

      await fetchProducts();
      await fetchOrders();

      setResetModalOpen(false);
      setNewOrderAlert('✨ Database restored to clean default state!');
      setTimeout(() => setNewOrderAlert(null), 5000);
    } catch (err) {
      console.error('Failed to reset database:', err);
    } finally {
      setLoading(false);
    }
  };

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      category: 'Electronics',
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
      image_url: p.image_url,
      category: p.category || 'Electronics',
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      image_url: productForm.image_url,
      category: productForm.category,
      seller_email: currentAdminEmail,
      seller_name: currentAdminEmail.split('@')[0],
    };

    try {
      if (editingProduct) {
        // Update
        const { error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id);

        if (!error) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productPayload } : p))
          );
        }
      } else {
        // Insert
        const { data, error } = await supabase
          .from('products')
          .insert([productPayload])
          .select()
          .single();

        if (!error && data) {
          setProducts((prev) => [data as Product, ...prev]);
        }
      }
      setProductModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  // Confirm Modern Delete
  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await supabase.from('products').delete().eq('id', productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    } catch (e) {
      console.error('Error deleting product:', e);
    } finally {
      setProductToDelete(null);
    }
  };

  // ==========================================
  // SINGLE MERCHANT STORE OPERATIONS
  // ==========================================
  const displayedProducts = products;
  const storeOrders = orders;

  // Metrics calculated across store operations
  const totalRevenue = storeOrders.reduce(
    (sum, o) => sum + (o.status !== 'cancelled' ? Number(o.total_amount) : 0),
    0
  );
  const totalOrders = storeOrders.length;
  const completedOrders = storeOrders.filter((o) => o.status === 'completed').length;
  const pendingOrders = storeOrders.filter((o) => o.status === 'pending').length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Chart Data for Store Operations
  const chartData = storeOrders
    .slice()
    .reverse()
    .map((o, idx) => ({
      name: `Order #${idx + 1}`,
      amount: Number(o.total_amount),
      customer: o.customer_name,
    }));

  const statusPieData = [
    { name: 'Completed', value: storeOrders.filter((o) => o.status === 'completed').length, color: '#10b981' },
    { name: 'Processing', value: storeOrders.filter((o) => o.status === 'processing').length, color: '#3b82f6' },
    { name: 'Pending', value: storeOrders.filter((o) => o.status === 'pending').length, color: '#f59e0b' },
    { name: 'Cancelled', value: storeOrders.filter((o) => o.status === 'cancelled').length, color: '#f43f5e' },
  ].filter((item) => item.value > 0);

  const filteredOrders = storeOrders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-24 pt-8 print:bg-white print:p-0 print:text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Real-time Notification Banner */}
        {newOrderAlert && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-indigo-900/90 to-cyan-900/90 p-4 text-xs sm:text-sm font-bold text-white shadow-xl shadow-cyan-500/20 backdrop-blur-xl animate-bounce print:hidden">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-cyan-300 animate-spin" />
              <span>{newOrderAlert}</span>
            </div>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6 print:hidden">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                NovaStore Live Operations Dashboard
              </h1>
              {/* Connection Status Pill */}
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                  realtimeConnected
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                }`}
              >
                <Radio className={`h-3.5 w-3.5 ${realtimeConnected ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
                <span>{realtimeConnected ? 'Live WebSockets Active' : 'Connecting...'}</span>
              </div>

              {/* Logged in Admin Pill */}
              <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <User className="h-3.5 w-3.5 text-indigo-400" />
                <span>Admin Officer: {currentAdminEmail}</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Real-time incoming orders, sales analytics charts, courier fulfillment, and catalog inventory
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex rounded-xl border border-white/10 bg-slate-900 p-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Orders & Sales ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === 'products'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Store Catalog ({products.length})</span>
              </button>
            </div>

            {activeTab === 'orders' && (
              <>
                <button
                  onClick={() => setPaymentSettingsOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all shadow-sm"
                  title="Configure Seller QRIS & Bank Info"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>QRIS & Bank Setup</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-sm"
                  title="Export orders to CSV / Excel"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleSimulateOrder}
                  className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all active:scale-95 shadow-sm"
                  title="Test real-time event simulation"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Simulate Order</span>
                </button>

                <button
                  onClick={handleSeedDatabase}
                  className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all active:scale-95 shadow-sm"
                  title="Seed sample products and real-time orders into database"
                >
                  <Database className="h-3.5 w-3.5" />
                  <span>Seed Demo Data</span>
                </button>

                <button
                  onClick={() => setResetModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all active:scale-95 shadow-sm"
                  title="Clear test orders or reset database to default"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Reset Data</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                fetchOrders();
                fetchProducts();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-white transition-all shadow-sm"
              title="Sign Out of Admin Portal"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ORDERS & ANALYTICS */}
        {activeTab === 'orders' && (
          <>
            {/* KPI Metrics Grid */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-black text-white">{formatPrice(totalRevenue)}</h3>
                  <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Real-time Gross Sales</span>
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Total Orders</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-black text-white">{totalOrders}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {completedOrders} completed • {pendingOrders} pending
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Average Order Value</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-black text-white">{formatPrice(averageOrderValue)}</h3>
                  <p className="mt-1 text-xs text-slate-400">Per customer checkout</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Fulfillment Rate</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-black text-white">
                    {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
                  </h3>
                  <p className="mt-1 text-xs text-emerald-400">Success conversion</p>
                </div>
              </div>
            </div>

            {/* Visual Analytics Section */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl lg:col-span-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Sales Revenue Stream</h3>
                    <p className="text-xs text-slate-400">Live order values plotted in real-time</p>
                  </div>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    Active Feed
                  </span>
                </div>

                <div className="h-72 w-full">
                  {chartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">
                      No order data available yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis
                          stroke="#64748b"
                          fontSize={11}
                          tickLine={false}
                          tickFormatter={(v) => `Rp ${(v / 1000).toLocaleString('id-ID')}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '12px',
                          }}
                          formatter={(value: any) => [formatPrice(Number(value)), 'Order Total']}
                          labelFormatter={(label) => `Transaction: ${label}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#818cf8"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorSales)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl lg:col-span-4">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white">Order Status Mix</h3>
                  <p className="text-xs text-slate-400">Distribution by fulfillment phase</p>
                </div>

                <div className="h-72 w-full flex items-center justify-center">
                  {statusPieData.length === 0 ? (
                    <div className="text-xs text-slate-500">No transaction data yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {statusPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '12px',
                          }}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                          formatter={(val) => <span className="text-slate-300">{val}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Live Orders Table */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Live Transactions & Orders</h3>
                  <p className="text-xs text-slate-400">
                    Realtime synchronization • Multi-Courier & Payment Verification
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex rounded-xl border border-white/10 bg-slate-800/80 p-1 text-xs">
                    {['all', 'pending', 'processing', 'completed', 'cancelled'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`rounded-lg px-3 py-1.5 font-semibold capitalize transition-all ${
                          statusFilter === tab
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search customer/ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 text-slate-400">
                    <tr>
                      <th className="pb-3 font-semibold">Order ID</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Courier Logistics</th>
                      <th className="pb-3 font-semibold">Date & Time</th>
                      <th className="pb-3 font-semibold">Payment & Proof</th>
                      <th className="pb-3 font-semibold">Total Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          Loading orders...
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const statusConfig = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                        return (
                          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 font-mono font-bold text-cyan-400">
                              {order.id.slice(0, 12)}...
                            </td>
                            <td className="py-4">
                              <div className="font-semibold text-white">{order.customer_name}</div>
                              <div className="text-[11px] text-slate-400">{order.customer_email}</div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-1.5">
                                <Truck className="h-3.5 w-3.5 text-indigo-400" />
                                <span className="font-semibold text-white">
                                  {order.shipping_courier || 'JNE Express'}
                                </span>
                              </div>
                              <div className="text-[10px] text-cyan-400 mt-0.5">
                                Ongkir: {formatPrice(order.shipping_cost || 0)}
                              </div>
                            </td>
                            <td className="py-4 text-slate-400">
                              {formatDate(order.created_at || new Date().toISOString())}
                            </td>
                            <td className="py-4">
                              <div className="capitalize text-slate-300 font-medium">
                                {order.payment_method?.replace(/_/g, ' ') || 'QRIS'}
                              </div>
                              {order.payment_proof_url ? (
                                <button
                                  onClick={() => setProofPreviewUrl(order.payment_proof_url || null)}
                                  className="mt-1 inline-flex items-center gap-1 rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all"
                                >
                                  <Paperclip className="h-3 w-3" />
                                  <span>Receipt Attached</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-500">No Attachment</span>
                              )}
                            </td>
                            <td className="py-4 font-bold text-white">
                              {formatPrice(Number(order.total_amount))}
                            </td>
                            <td className="py-4">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleUpdateStatus(order.id, e.target.value as OrderStatus)
                                }
                                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize bg-slate-900 focus:outline-none ${statusConfig.border} ${statusConfig.text}`}
                              >
                                <option value="pending" className="bg-slate-900 text-amber-400">Pending</option>
                                <option value="processing" className="bg-slate-900 text-blue-400">Processing</option>
                                <option value="completed" className="bg-slate-900 text-emerald-400">Completed</option>
                                <option value="cancelled" className="bg-slate-900 text-rose-400">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Inspect & Verify</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: PRODUCTS & INVENTORY CRUD */}
        {activeTab === 'products' && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Product Inventory & Catalog</h3>
                <p className="text-xs text-slate-400">Manage items, update stock levels, and set pricing</p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="pb-3 font-semibold">Product</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Stock</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {loadingProducts ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Loading catalog...
                      </td>
                    </tr>
                  ) : displayedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No products in your store yet. Click &apos;Add New Product&apos; above to start selling!
                      </td>
                    </tr>
                  ) : (
                    displayedProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800 border border-white/10">
                              <Image
                                src={p.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-white">{p.name}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{p.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 border border-cyan-500/20">
                            {p.category || 'General'}
                          </span>
                        </td>
                        <td className="py-4 font-bold text-white">{formatPrice(Number(p.price))}</td>
                        <td className="py-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                              p.stock <= 0
                                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                                : p.stock <= 5
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="Edit product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modern Delete Confirmation Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setProductToDelete(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl z-10 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Delete Product?</h3>
              <p className="mt-1 text-xs text-slate-400">
                Are you sure you want to permanently delete <strong className="text-white font-semibold">{productToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail & Official Corporate Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:static">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm print:hidden"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-10 shadow-2xl z-10 space-y-6 print:border-none print:shadow-none print:bg-white print:p-0 print:text-black">
            {/* Invoice Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 print:border-gray-300">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white print:border print:border-black">
                  <Store className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white print:text-black">NovaStore Corporate Invoice</h3>
                  <p className="font-mono text-xs text-cyan-400 print:text-black mt-0.5">{selectedOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white print:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Customer Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-white/5 bg-slate-800/50 p-4 text-xs print:bg-gray-50 print:border-gray-200">
              <div className="space-y-1.5 print:text-black">
                <p className="font-bold text-slate-400 uppercase tracking-wider print:text-gray-600">Customer Details</p>
                <div className="flex items-center gap-2 font-bold text-white print:text-black">
                  <User className="h-3.5 w-3.5 text-indigo-400 print:text-black" />
                  <span>{selectedOrder.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 print:text-gray-700">
                  <Mail className="h-3.5 w-3.5 text-indigo-400 print:text-black" />
                  <span>{selectedOrder.customer_email}</span>
                </div>
                {selectedOrder.customer_phone && (
                  <div className="flex items-center gap-2 text-slate-300 print:text-gray-700">
                    <Phone className="h-3.5 w-3.5 text-indigo-400 print:text-black" />
                    <span>{selectedOrder.customer_phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 print:text-black">
                <p className="font-bold text-slate-400 uppercase tracking-wider print:text-gray-600">Shipping & Delivery</p>
                <div className="flex items-start gap-2 text-slate-300 print:text-gray-700">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5 print:text-black" />
                  <span>{selectedOrder.customer_address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 print:text-gray-700 mt-1">
                  <Truck className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Courier: <strong>{selectedOrder.shipping_courier || 'JNE Express (Reguler)'}</strong></span>
                </div>
              </div>
            </div>

            {/* Payment Proof Verification Box */}
            {selectedOrder.payment_proof_url && (
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-3 print:hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>Customer Payment Receipt Proof Attached</span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                      selectedOrder.payment_verified
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {selectedOrder.payment_verified ? 'Verified & Stamped' : 'Pending Verification'}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    onClick={() => setProofPreviewUrl(selectedOrder.payment_proof_url || null)}
                    className="relative h-20 w-28 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-slate-950 hover:scale-105 transition-all shadow-md group"
                  >
                    <img
                      src={selectedOrder.payment_proof_url}
                      alt="Receipt Proof Thumbnail"
                      className="h-full w-full object-cover group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 text-xs space-y-2">
                    <p className="text-slate-300 text-[11px]">
                      Click image to expand. Verify amount and approve this transaction to begin dispatch.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleVerifyPayment(selectedOrder.id, true)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve Payment</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVerifyPayment(selectedOrder.id, false)}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-600/20 border border-rose-500/30 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-600 hover:text-white transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Line Table */}
            <div className="space-y-2 text-xs print:text-black">
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Payment Method</span>
                <span className="capitalize font-semibold text-white print:text-black">
                  {selectedOrder.payment_method?.replace(/_/g, ' ') || 'Cash on Delivery'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Courier Logistics</span>
                <span className="font-semibold text-cyan-400 print:text-black">
                  {selectedOrder.shipping_courier || 'JNE Express'} ({formatPrice(selectedOrder.shipping_cost || 0)})
                </span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Biaya Layanan / Admin (2.5%)</span>
                <span className="font-semibold text-amber-300 print:text-black">
                  {formatPrice(selectedOrder.admin_fee || Math.round(Number(selectedOrder.total_amount) * 0.025))}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Order Placed Timestamp</span>
                <span className="font-semibold text-white print:text-black">{formatDate(selectedOrder.created_at)}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Fulfillment Status</span>
                <span className="capitalize font-bold text-indigo-400 print:text-black">{selectedOrder.status}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-sm font-bold text-white print:border-gray-300 print:text-black">
                <span>Grand Total Amount</span>
                <span className="text-base text-cyan-400 print:text-black">{formatPrice(Number(selectedOrder.total_amount))}</span>
              </div>
            </div>

            {/* Authenticity Stamp */}
            <div className="rounded-xl border border-white/5 bg-slate-800/30 p-3 flex items-center justify-between text-[11px] print:bg-gray-50 print:border-gray-200">
              <div className="flex items-center gap-2 text-slate-300 print:text-gray-700">
                <ShieldCheck className="h-4 w-4 text-emerald-400 print:text-emerald-700" />
                <span>Verified Supabase Real-time Transaction Record</span>
              </div>
              <span className="font-mono text-slate-500 print:text-gray-500">UUID-SYNCED</span>
            </div>

            <div className="flex justify-between gap-2 pt-2 print:hidden">
              <button
                onClick={() =>
                  router.push(
                    `/invoice/${selectedOrder.id}?officer=${encodeURIComponent(
                      currentAdminEmail
                    )}&courier=${encodeURIComponent(
                      selectedOrder.shipping_courier || 'JNE Express'
                    )}&admin_fee=${selectedOrder.admin_fee || ''}&shipping=${selectedOrder.shipping_cost || ''}`
                  )
                }
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
              >
                <Printer className="h-4 w-4" />
                <span>View & Print Official Tax Invoice (PDF)</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Receipt Fullscreen Lightbox Modal */}
      {proofPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
            onClick={() => setProofPreviewUrl(null)}
          />
          <div className="relative max-w-2xl w-full rounded-3xl border border-white/10 bg-slate-900 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-indigo-400" />
                <span>Payment Receipt Screenshot Preview</span>
              </h4>
              <button
                onClick={() => setProofPreviewUrl(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative max-h-[70vh] overflow-auto rounded-xl border border-white/10 bg-slate-950 flex items-center justify-center p-2">
              <img
                src={proofPreviewUrl}
                alt="Full Payment Proof"
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setProofPreviewUrl(null)}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seller QRIS & Bank Settings Modal */}
      {paymentSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setPaymentSettingsOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                  <QrCode className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Merchant QRIS & Bank Accounts</h3>
                  <p className="text-[10px] text-slate-400">Direct-to-Seller 0% Fee Payouts</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentSettingsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Bank Transfer Account Info
                </label>
                <textarea
                  rows={2}
                  value={sellerBankInfo}
                  onChange={(e) => setSellerBankInfo(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. BCA: 8831-2941-002 (PT Nova Digital)"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Custom Static QRIS Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={sellerQrisUrl}
                  onChange={(e) => setSellerQrisUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="https://your-domain.com/my-qris.jpg"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Leave empty to use automatic zero-fee dynamic QRIS.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-[11px] text-cyan-300 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Zero transaction fees (0% MDR). All buyer payments route directly to your account.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPaymentSettingsOpen(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentSettingsOpen(false);
                  setNewOrderAlert('✅ Store Payment & QRIS settings saved successfully!');
                  setTimeout(() => setNewOrderAlert(null), 4000);
                }}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Create/Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setProductModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultra Gaming Headset"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800/80 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Product specifications and features..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800/80 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Price (IDR)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 750000"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800/80 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">Inventory Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 25"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800/80 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800/80 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800/80 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Database Reset & Test Data Clearance Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setResetModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-rose-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Reset Store &amp; Order Data</h3>
                  <p className="text-xs text-slate-400">Admin Account (<code className="text-cyan-300">admin@novastore.com</code>) will remain intact</p>
                </div>
              </div>
              <button
                onClick={() => setResetModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Choose the reset mode that fits your current demonstration needs:
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleClearAllOrders}
                disabled={loading}
                className="w-full flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-800/60 p-4 text-left hover:bg-slate-800 hover:border-indigo-500/40 transition-all group"
              >
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  🧹
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Mode 1: Clear All Test Orders (0 Orders)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Deletes all transactions and invoices, leaving your store products intact. Perfect for testing a brand new incoming order simulation from scratch!
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleResetPristineDefault}
                disabled={loading}
                className="w-full flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-left hover:bg-rose-500/10 hover:border-rose-500/40 transition-all group"
              >
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  ✨
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                    Mode 2: Full Restore to Pristine Default
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Restores the default 6 flagship products (Apex Pro, AeroFit, Vanguard, etc.) and 3 starter demonstration orders for immediate chart metrics.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
