import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d9488",
        "background-light": "#f5f5f4",
        "background-dark": "#020617"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "8px"
      }
    }
  },
  plugins: [forms, typography, containerQueries]
};

export default config;
