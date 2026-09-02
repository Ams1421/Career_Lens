/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#030712",      // Deepest background
        cardBg: "#0b1021",      // Glassmorphism card background
        cardHover: "#111827",   // Card hover state
        neonBlue: "#3b82f6",
        neonPurple: "#a855f7",
        neonCyan: "#06b6d4",
        neonEmerald: "#10b981",
      },
      boxShadow: {
        'neon-glow': '0 0 20px rgba(168, 85, 247, 0.15)',
        'card-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}