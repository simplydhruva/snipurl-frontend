/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: "#00f5ff",
        neonPurple: "#a855f7",
        darkBg: "#0a0a0f",
      },
      boxShadow: {
        neon: "0 0 20px rgba(168,85,247,0.6)",
      },
    },
  },
  plugins: [],
}