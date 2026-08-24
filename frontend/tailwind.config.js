/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
    slideFadeIn: {
      "0%": { opacity: 0, transform: "translateY(1rem) scale(1)" },
      "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
    },
  },
  animation: {
    slideFadeIn: "slideFadeIn 0.5s ease-out forwards",
  },
      colors: {
        neonYellow: "#f6ff00",
        neonGreen: "#00ff73",
      },
      animation: {
    'fade-in': 'fade-in 0.5s ease-in-out'
  }
    },
  },
  
  plugins: [],
}
