import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending: {
    bg: 'bg-amber-500/10 text-amber-500',
    text: 'text-amber-500',
    border: 'border-amber-500/20',
  },
  processing: {
    bg: 'bg-blue-500/10 text-blue-500',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
  },
  completed: {
    bg: 'bg-emerald-500/10 text-emerald-500',
    text: 'text-emerald-500',
    border: 'border-emerald-500/20',
  },
  cancelled: {
    bg: 'bg-rose-500/10 text-rose-500',
    text: 'text-rose-500',
    border: 'border-rose-500/20',
  },
};
