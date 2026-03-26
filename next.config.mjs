/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      { protocol:'https', hostname:'res.cloudinary.com' },
      { protocol:'https', hostname:'*.supabase.co' },
      { protocol:'https', hostname:'*.supabase.com' },
      { protocol:'https', hostname:'lh3.googleusercontent.com' },
      { protocol:'https', hostname:'avatars.githubusercontent.com' },
      { protocol:'https', hostname:'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      // صفحات عامة — cache 5 دقائق، revalidate في الخلفية
      {
        source: '/(courses|instructors|faq|blog|about|contact|privacy|terms)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
      // الصفحة الرئيسية
      {
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
        ],
      },
      // صفحات الدورات الفردية — cache 10 دقائق
      {
        source: '/courses/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=600, stale-while-revalidate=1200' },
        ],
      },
      // Dashboard وصفحات Auth — لا cache
      {
        source: '/dashboard/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
      {
        source: '/auth/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      // الأصول الثابتة — cache سنة كاملة
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Security headers لكل الصفحات
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection',       value: '1; mode=block' },
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
