/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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
    },
  },
  plugins: [],
} 