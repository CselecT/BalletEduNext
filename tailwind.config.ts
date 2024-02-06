import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  plugins: [require("daisyui"),require('flowbite/plugin')],
  daisyui: {
    themes: ["light", "dark", "cupcake","valentine"],
  },
};
export default config;
