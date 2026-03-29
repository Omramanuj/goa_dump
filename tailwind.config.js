/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E0C0A",
        accent: "#FF6B35",
        gold: "#E9A800",
        mist: "#F5EFE8",
        smoke: "#A59A90",
        panel: "#171311"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(255, 107, 53, 0.18)"
      }
    }
  },
  plugins: []
};
