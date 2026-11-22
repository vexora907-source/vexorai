/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        vexora: {
          950: '#0b0714',
          900: '#171027',
          700: '#5b21b6',
          500: '#8b5cf6',
          300: '#d8b4fe',
        },
      },
    },
  },
  plugins: [],
};
