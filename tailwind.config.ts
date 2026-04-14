import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7ee',
          100: '#d8efd4',
          200: '#b3dea9',
          300: '#82c574',
          400: '#57a84a',
          500: '#3a8c30',
          600: '#2a6b22',
          700: '#1e4f19',
          800: '#143510',
          900: '#0f1a0e',
        },
        ember: {
          300: '#f5d98a',
          400: '#e8c87a',
          500: '#d4a843',
          600: '#c4622d',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
