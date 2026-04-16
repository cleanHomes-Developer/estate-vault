import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["DM Sans", "Helvetica Neue", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        parchment: {
          DEFAULT: "#FAF7F2",
          dark: "#F3EDE4",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          muted: "#6B6459",
        },
        gold: {
          DEFAULT: "#B8860B",
          hover: "#9A7209",
          light: "#F5E6C8",
        },
        vault: {
          DEFAULT: "#0F0F0F",
          elevated: "#1A1A1A",
          card: "#222222",
        },
        success: {
          DEFAULT: "#2D6A4F",
          light: "#40916C",
        },
        danger: {
          DEFAULT: "#9B2C2C",
          light: "#E53E3E",
        },
        warning: {
          DEFAULT: "#DD6B20",
        },
      },
      maxWidth: {
        container: "1200px",
        narrow: "800px",
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.05)",
        card: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
        elevated: "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};
export default config;
