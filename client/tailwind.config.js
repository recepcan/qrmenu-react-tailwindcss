/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind"; // ✅ require yerine import kullan

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ...flowbite.content(), // ✅ flowbite içeriğini ekle
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin()],
};
