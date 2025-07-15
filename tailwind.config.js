/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        'sans': ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        'offbit-101': ['var(--font-offbit-101)'],
        'offbit-101-bold': ['var(--font-offbit-101-bold)'],
        'offbit-bold': ['var(--font-offbit-bold)'],
        'offbit-dot': ['var(--font-offbit-dot)'],
        'offbit-dot-bold': ['var(--font-offbit-dot-bold)'],
        'offbit-regular': ['var(--font-offbit-regular)'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'scroll-left': 'scroll-left 12s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
} 