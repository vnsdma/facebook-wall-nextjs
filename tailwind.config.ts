import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fb: {
          blue: "#3b5998",
          darkBlue: "#2f477a",
          headerBlue: "#6d84b4",
          lightBlue: "#eceff5",
          border: "#d8dfea",
          darkBorder: "#b3c0d4",
          text: "#333333",
          link: "#3b5998",
          muted: "#777777",
          bg: "#f7f7f7",
          panel: "#ffffff",
          button: "#eceff5",
          buttonBorder: "#96a6c5",
        },
      },
    },
  },
  plugins: [],
};

export default config;
