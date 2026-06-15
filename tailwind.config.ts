import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sarabun: ['var(--font-sarabun)', 'Sarabun', 'sans-serif'],
      },
      colors: {
        primary:   '#1E40AF',
        secondary: '#3B82F6',
        sci:       '#10B981',
        mat:       '#F59E0B',
        tha:       '#EC4899',
      },
    },
  },
  plugins: [],
}

export default config
