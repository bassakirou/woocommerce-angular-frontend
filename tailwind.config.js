/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#009F7F',
        'primary-dark': '#008F6F'
      }
    },
  },
  plugins: [],
}
