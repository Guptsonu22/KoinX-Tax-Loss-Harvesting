/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kx-dark': '#0D1321',
        'kx-darker': '#060D1A',
        'kx-card': '#0F1923',
        'kx-card-alt': '#132032',
        'kx-border': '#1E293B',
        'kx-border-light': '#243447',
        'kx-blue': '#3B82F6',
        'kx-blue-dark': '#1D4ED8',
        'kx-green': '#22C55E',
        'kx-red': '#EF4444',
        'kx-text': '#E2E8F0',
        'kx-muted': '#94A3B8',
        'kx-subtle': '#64748B',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', maxHeight: '0' },
          '100%': { opacity: '1', maxHeight: '500px' },
        },
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(135deg, #1a3a6b 0%, #0f2249 100%)',
        'card-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
