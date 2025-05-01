import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#202a36",
          light: "#cdcdcd",
        },
        buttons: {
          primary: "#0151c4",
          gradientlight: "#216ba2",
          gradientdark: "#544a93",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
} satisfies Config;
