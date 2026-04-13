/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf6f4',
          100: '#f9eee9',
          200: '#f2ddd5',
          300: '#eabcac',
          400: '#e1957c',
          500: '#d97757',
          600: '#cc5c3b',
          700: '#aa472a',
          800: '#8c3c26',
          900: '#713322',
        },
        success: {
          50:  '#eaf3de',
          100: '#c0dd97',
          200: '#97c459',
          500: '#639922',
          700: '#3b6d11',
          900: '#173404',
        },
        danger: {
          50:  '#fcebeb',
          100: '#f7c1c1',
          500: '#e24b4a',
          700: '#a32d2d',
        },
        warning: {
          50:  '#faeeda',
          100: '#fac775',
          500: '#ef9f27',
          700: '#854f0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
