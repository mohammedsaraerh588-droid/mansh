/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol:'https', hostname:'res.cloudinary.com' },
      { protocol:'https', hostname:'*.supabase.co' },
      { protocol:'https', hostname:'*.supabase.com' },
      { protocol:'https', hostname:'cdn.playnaas.com' },
      { protocol:'https', hostname:'lh3.googleusercontent.com' },
      { protocol:'https', hostname:'avatars.githubusercontent.com' },
      { protocol:'https', hostname:'images.unsplash.com' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000', 'mansh-eta.vercel.app'] },
  },
}

export default nextConfig
