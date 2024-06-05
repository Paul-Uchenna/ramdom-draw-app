/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        bImg: "url('../images/B2.jpg')",
      },
      colors: {
        customRed: "#d90000",
      },
    },
  },
  plugins: [],
};
