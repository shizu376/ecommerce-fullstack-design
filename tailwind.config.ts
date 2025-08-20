import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brandBlue: "#0D6EFD", // Figma Primary
        brandGray: "#F8F9FA",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Matches modern UI designs
      },
    },
  },
  plugins: [],
} satisfies Config;

