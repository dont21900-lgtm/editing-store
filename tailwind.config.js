/** @type {import('tailwindcss').Config} */
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Parkinsans', 'sans-serif'],
        sans: ['Author', 'sans-serif'],
      },
    },
  },
  plugins: [
    typographyPlugin,
  ],
};