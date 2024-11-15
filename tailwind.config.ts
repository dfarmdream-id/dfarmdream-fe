import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f6646",
        },
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#0f6646",
            },
            secondary: {
              DEFAULT: "#f3cb52",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#0f6646",
            },
            secondary: {
              DEFAULT: "#f3cb52",
            },
          },
        },
      },
    }),
  ],
} satisfies Config;
