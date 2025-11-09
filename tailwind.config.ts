import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/ui/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#fefdf9",
          100: "#fdf9f0",
          200: "#f9f1dd"
        },
        cacao: {
          500: "#6b3a2a",
          600: "#532d21"
        },
        burgundy: {
          500: "#7a1f33",
          600: "#611627"
        }
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "system-ui"]
      },
      boxShadow: {
        soft: "0 20px 45px -20px rgba(107, 58, 42, 0.4)"
      }
    }
  },
  plugins: [animatePlugin]
};

export default config;
