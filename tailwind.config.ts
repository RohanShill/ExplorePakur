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
        pine: {
          950: '#060B08',
          900: '#0B130E', // Primary Background
          850: '#0E1912',
          800: '#111E16', // Card / Container Surface
          750: '#16281E',
          700: '#1D3528',
          600: '#254735',
        },
        forest: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        // Terracotta Rust & Earth Clay (Santhal Soil Palette)
        terracotta: {
          300: '#FFA085',
          400: '#FF6B4A', // Vibrant Terracotta Accent
          500: '#E05A38',
          600: '#C84626',
          700: '#A13217',
          900: '#4A1408',
        },
        clay: {
          300: '#FCD34D',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-terracotta': '0 0 20px rgba(255, 107, 74, 0.4)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-clay': '0 0 20px rgba(245, 158, 11, 0.35)',
      },
    },
  },
  plugins: [],
};
export default config;
