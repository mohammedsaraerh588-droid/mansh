import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = 'USD') {
  if (price === 0) return 'مجاني'
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDuration(hours: number) {
  if (hours < 1) return `${Math.round(hours * 60)} دقيقة`
  if (hours === 1) return 'ساعة واحدة'
  if (hours === 2) return 'ساعتان'
  if (hours <= 10) return `${hours} ساعات`
  return `${hours} ساعة`
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim()
}

export function getLevelLabel(level: string) {
  const labels: Record<string, string> = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
    all: 'جميع المستويات',
  }
  return labels[level] || level
}

export function getInitials(name: string | null | undefined) {
  if (!name) return 'م'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function truncate(text: string, length = 100) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function timeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000
  if (diff < 60) return 'منذ لحظات'
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
  if (diff < 2592000) return `منذ ${Math.floor(diff / 86400)} يوم`
  return formatDate(date)
}

export function generateVerificationCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}
