import { supabase, Product, Order, OrderItem } from './supabase';
import { DEFAULT_CATALOG_PRODUCTS, DEFAULT_STARTER_ORDERS } from './defaultCatalog';

const STOCK_OVERRIDES_KEY = 'novastore_stock_overrides';
const LOCAL_ORDERS_KEY = 'novastore_local_orders';
const ORDERS_CLEARED_FLAG = 'novastore_orders_cleared';

/**
 * Reads local stock overrides from localStorage
 */
export function getLocalStockOverrides(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STOCK_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Saves local stock overrides
 */
export function saveLocalStockOverride(productId: string, stock: number) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalStockOverrides();
    current[productId] = Math.max(0, stock);
    localStorage.setItem(STOCK_OVERRIDES_KEY, JSON.stringify(current));
    window.dispatchEvent(
      new CustomEvent('novastore:stock_updated', {
        detail: { productId, stock: current[productId] },
      })
    );
  } catch (err) {
    console.warn('Could not save local stock override:', err);
  }
}

/**
 * Reconciles product list with local overrides and default fallbacks
 */
export function reconcileProducts(rawProducts: Product[] | null | undefined): Product[] {
  const baseList =
    rawProducts && rawProducts.length > 0 ? rawProducts : DEFAULT_CATALOG_PRODUCTS;
  const overrides = getLocalStockOverrides();

  return baseList.map((product) => {
    if (typeof overrides[product.id] === 'number') {
      return { ...product, stock: overrides[product.id] };
    }
    return product;
  });
}

/**
 * Deducts stock for a list of items across Supabase and local cache
 */
export async function deductStock(items: { productId: string; quantity: number }[]) {
  const overrides = getLocalStockOverrides();

  for (const item of items) {
    try {
      // 1. Try atomic Supabase RPC if available
      const { error: rpcErr } = await supabase.rpc('deduct_product_stock', {
        p_product_id: item.productId,
        p_quantity: item.quantity,
      });

      if (rpcErr) {
        // Fallback to standard Supabase update
        const { data: prod } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .maybeSingle();

        if (prod && typeof prod.stock === 'number') {
          const newStock = Math.max(0, prod.stock - item.quantity);
          await supabase.from('products').update({ stock: newStock }).eq('id', item.productId);
          overrides[item.productId] = newStock;
        } else {
          // If not found in Supabase or using local catalog
          const defaultProd = DEFAULT_CATALOG_PRODUCTS.find((p) => p.id === item.productId);
          const cur = overrides[item.productId] ?? defaultProd?.stock ?? 10;
          overrides[item.productId] = Math.max(0, cur - item.quantity);
        }
      }
    } catch (err) {
      console.warn('Supabase stock deduction error (using local override fallback):', err);
      const defaultProd = DEFAULT_CATALOG_PRODUCTS.find((p) => p.id === item.productId);
      const cur = overrides[item.productId] ?? defaultProd?.stock ?? 10;
      overrides[item.productId] = Math.max(0, cur - item.quantity);
    }
  }

  // Persist updated overrides & broadcast
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STOCK_OVERRIDES_KEY, JSON.stringify(overrides));
      window.dispatchEvent(
        new CustomEvent('novastore:stock_updated', {
          detail: { overrides },
        })
      );
    } catch {}
  }
}

/**
 * Restores product stock (e.g. upon order cancellation)
 */
export async function restoreStock(items: { productId: string; quantity: number }[]) {
  const overrides = getLocalStockOverrides();

  for (const item of items) {
    try {
      const { data: prod } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.productId)
        .maybeSingle();

      if (prod && typeof prod.stock === 'number') {
        const newStock = prod.stock + item.quantity;
        await supabase.from('products').update({ stock: newStock }).eq('id', item.productId);
        overrides[item.productId] = newStock;
      } else {
        const defaultProd = DEFAULT_CATALOG_PRODUCTS.find((p) => p.id === item.productId);
        const cur = overrides[item.productId] ?? defaultProd?.stock ?? 10;
        overrides[item.productId] = cur + item.quantity;
      }
    } catch (err) {
      console.warn('Supabase stock restore error (using local override fallback):', err);
      const defaultProd = DEFAULT_CATALOG_PRODUCTS.find((p) => p.id === item.productId);
      const cur = overrides[item.productId] ?? defaultProd?.stock ?? 10;
      overrides[item.productId] = cur + item.quantity;
    }
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STOCK_OVERRIDES_KEY, JSON.stringify(overrides));
      window.dispatchEvent(
        new CustomEvent('novastore:stock_updated', {
          detail: { overrides },
        })
      );
    } catch {}
  }
}

/**
 * Clears all orders & order items with cascade safety
 */
export async function clearAllOrders(): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Delete order_items first
    await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // 2. Delete orders
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 3. Clear local storage flags
    if (typeof window !== 'undefined') {
      localStorage.setItem(ORDERS_CLEARED_FLAG, 'true');
      localStorage.removeItem(LOCAL_ORDERS_KEY);
      window.dispatchEvent(new CustomEvent('novastore:orders_cleared'));
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to clear orders:', err);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ORDERS_CLEARED_FLAG, 'true');
      localStorage.removeItem(LOCAL_ORDERS_KEY);
      window.dispatchEvent(new CustomEvent('novastore:orders_cleared'));
    }
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/**
 * Complete Database Reset: Clears all records and seeds pristine catalog + starter orders
 */
export async function resetDatabaseToPristine(): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ORDERS_CLEARED_FLAG);
      localStorage.removeItem(STOCK_OVERRIDES_KEY);
      localStorage.removeItem(LOCAL_ORDERS_KEY);
    }

    // 1. Try atomic PostgreSQL RPC reset if available
    try {
      const { error: rpcErr } = await supabase.rpc('reset_to_pristine_catalog');
      if (!rpcErr) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('novastore:database_reset'));
        }
        return { success: true };
      }
    } catch {}

    // 2. Step-by-step cascade deletion
    await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 3. Insert pristine products
    const productsToInsert = DEFAULT_CATALOG_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      image_url: p.image_url,
      category: p.category,
      seller_email: p.seller_email || 'official@novastore.com',
      seller_name: p.seller_name || 'NovaStore Flagship',
    }));

    await supabase.from('products').insert(productsToInsert);

    // 4. Insert starter demo orders
    for (const ord of DEFAULT_STARTER_ORDERS) {
      await supabase.from('orders').insert({
        id: ord.id,
        customer_name: ord.customer_name,
        customer_email: ord.customer_email,
        customer_phone: ord.customer_phone,
        customer_address: ord.customer_address,
        total_amount: ord.total_amount,
        admin_fee: ord.admin_fee,
        shipping_courier: ord.shipping_courier,
        shipping_cost: ord.shipping_cost,
        destination_lat: ord.destination_lat,
        destination_lng: ord.destination_lng,
        payment_method: ord.payment_method,
        payment_verified: ord.payment_verified,
        status: ord.status,
        seller_email: ord.seller_email || 'official@novastore.com',
        created_at: ord.created_at,
      });

      if (ord.order_items && ord.order_items.length > 0) {
        for (const item of ord.order_items) {
          await supabase.from('order_items').insert({
            id: item.id,
            order_id: ord.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal,
          });
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('novastore:database_reset'));
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to reset database:', err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('novastore:database_reset'));
    }
    return { success: false, error: err?.message || 'Database reset exception' };
  }
}

/**
 * Subscribes to Supabase Real-time products channel & local window events
 */
export function subscribeToStockUpdates(onUpdate: (productId?: string) => void) {
  // Supabase Real-time channel for products table
  const channel = supabase
    .channel('realtime_products_stock_sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  // Local window events
  const handleLocalUpdate = (e: any) => {
    onUpdate(e.detail?.productId);
  };

  const handleReset = () => {
    onUpdate();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('novastore:stock_updated', handleLocalUpdate);
    window.addEventListener('novastore:database_reset', handleReset);
  }

  return () => {
    supabase.removeChannel(channel);
    if (typeof window !== 'undefined') {
      window.removeEventListener('novastore:stock_updated', handleLocalUpdate);
      window.removeEventListener('novastore:database_reset', handleReset);
    }
  };
}
