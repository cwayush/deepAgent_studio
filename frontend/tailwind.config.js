/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        chat: {
          'bg-main': '#212121',
          'bg-sidebar': '#171717',
          'surface': '#2f2f2f',
          'border': '#424242',
          'text-main': '#ececec',
          'text-muted': '#b4b4b4',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
