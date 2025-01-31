// tailwind.config.mjs
import flowbite from "flowbite-react/tailwind";
import scrollbarHide from "tailwind-scrollbar-hide";
import tailwindScrollbar from 'tailwind-scrollbar'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "400px", // 400px için özel bir 'xs' medya sorgusu oluştur
      },
    },
  },
  plugins: [flowbite.plugin(),scrollbarHide,tailwindScrollbar],
};
