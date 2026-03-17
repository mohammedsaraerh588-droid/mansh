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
  // Map of Arabic characters to English equivalents for URL-friendly slugs
  const arabicMap: Record<string, string> = {
    'ا': 'a', 'أ': 'a', 'إ': 'a', 'آ': 'a',
    'ب': 'b', 'ت': 't', 'ث': 'th',
    'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh',
    'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
    'ع': 'a', 'غ': 'gh',
    'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
    'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
    'ة': 'a'
  }

  let slug = text.toLowerCase()
  
  // Replace Arabic characters
  for (const [arabic, english] of Object.entries(arabicMap)) {
    slug = slug.replace(new RegExp(arabic, 'g'), english)
  }
  
  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-')
  
  // Remove special characters except hyphens
  slug = slug.replace(/[^a-z0-9-]/g, '')
  
  // Replace multiple hyphens with single hyphen
  slug = slug.replace(/-+/g, '-')
  
  // Trim hyphens from start and end
  slug = slug.replace(/^-+|-+$/g, '')
  
  return slug
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
