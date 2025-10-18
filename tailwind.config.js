/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2c3e50",
        secondary: "#555555",
        text: "#333333",
      },
      fontFamily: {
        "ats-safe": [
          "Arial",
          "Helvetica",
          "Times New Roman",
          "Georgia",
          "Calibri",
          "sans-serif",
        ],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
  plugins: [],
};
