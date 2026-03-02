/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'usc-pink': '#F72585',
        'usc-deep': '#081031',
        'usc-royal': '#0065FF',
        'usc-sky': '#0EE2E2',
      },
      borderRadius: {
        '4xl': '3rem',
      }
    },
  },
  plugins: [],
}