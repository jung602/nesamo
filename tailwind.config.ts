import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media', // This allows manual toggling of dark mode
  theme: {
    extend: {
      fontFamily: {
        'handwriting': ['Reenie Beanie', 'cursive'],
        'handwritingCJK': ['Nanum Pen Script', 'cursive'],
      },
      keyframes: {
        'curtain-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'curtain-down': 'curtain-down 0.5s ease-in-out',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;