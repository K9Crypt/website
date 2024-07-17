import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      colors: {
        dark: {
          background: "#1a202c",
          text: "#cbd5e0",
        },
        light: {
          background: "#fff",
          text: "#0000",
        },
      },
    },
  },

  plugins: [],
} as Config;