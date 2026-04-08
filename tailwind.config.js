/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./*.{js,jsx}", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        lime: "#CAFF00",
        neon: "#00F5FF",
        hot: "#FF2D78",
        blaze: "#FF6B00",
        violet: "#9B5CFF",
        bg: "#0A0A0F",
        surface: "#13131A",
        surface2: "#1C1C28",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
        body: ["Cabin", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
