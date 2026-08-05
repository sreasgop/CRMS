/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0066cc',
          blueHover: '#0071e3',
          blueDark: '#2997ff',
          ink: '#1d1d1f',
          parchment: '#f5f5f7',
          pearl: '#fafafc',
          tile1: '#272729',
          tile2: '#2a2a2c',
          hairline: '#e0e0e0',
          divider: '#f0f0f0',
        },
      },
      fontFamily: {
        sans: ['SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'apple-sm': '8px',
        'apple-md': '11px',
        'apple-lg': '18px',
        'apple-pill': '9999px',
      },
      boxShadow: {
        'apple-product': '0px 5px 30px 0px rgba(0, 0, 0, 0.22)',
      },
    },
  },
  plugins: [],
};
