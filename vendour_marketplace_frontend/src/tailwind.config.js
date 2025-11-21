/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust for your framework
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": "#1DB954",
        "secondary-color": "#EAF0F1",
      },
      fontFamily: {},
    },
  },
  plugins: [
  ],
};
