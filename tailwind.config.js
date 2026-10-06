/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060A12',
          900: '#0B132B',
          850: '#111B38',
          800: '#1C2541',
          700: '#2A365C',
          600: '#3A4B7C',
        },
        cyan: {
          400: '#38BDF8',
          500: '#06B6D4',
          400: '#22D3EE',
        },
        brand: {
          accent: '#00F2FE',
          glow: 'rgba(6, 182, 212, 0.25)',
          critical: '#EF4444',
          high: '#F97316',
          medium: '#F59E0B',
          low: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scanLine 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        scanLine: {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
