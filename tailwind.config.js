module.exports = {
  content: ["./*/*.{liquid,html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
