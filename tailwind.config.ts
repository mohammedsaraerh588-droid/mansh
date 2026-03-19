import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'bg-primary': '#0f172a',
        'bg-secondary': '#1e293b',
        'bg-tertiary': '#334155',
        'surface': '#1e293b',
        'surface-2': '#334155',
        'surface-3': '#475569',
        
        'text-primary': '#f8fafc',
        'text-secondary': '#e2e8f0',
        'text-muted': '#94a3b8',
        
        'border': '#334155',
        'border-2': '#475569',
        
        'primary': '#3b82f6',
        'primary-light': '#60a5fa',
        'primary-dark': '#2563eb',
        
        'secondary': '#8b5cf6',
        'accent': '#06b6d4',
        
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
      },
      fontFamily: { 
        sans: ['Noto Sans Arabic', 'Plus Jakarta Sans', 'sans-serif'] 
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-in': 'slide-in-up 0.6s ease-out',
        'gradient': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' 
          },
        },
        'slide-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
