/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // no spaces!
  theme: {
    extend: {},
    container: {
      center: true, // optional, centers container
      padding: "1rem", // optional, adds padding
    },
  },
  plugins: [],
};
