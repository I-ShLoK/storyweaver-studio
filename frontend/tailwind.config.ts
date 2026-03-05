import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0b0b",
        surface: "#141414",
        primary: "#ff1f3d",
        accent: "#ff3b4f",
        text: "#eaeaea"
      }
    }
  },
  plugins: []
};

export default config;

