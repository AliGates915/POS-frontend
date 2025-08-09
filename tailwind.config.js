/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8", // Blue-700
        primaryDark: "#1e40af", // Blue-800
        accent: "#e94560",
        newPrimary: "#84CF16",
        secondary: "#58C5A0",
        Green: "#2B9943",
      
      },

      //Oragne #FF8901
      screens: {
        '900': '900px',
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")], 
};
