import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        "cYellow": "#B9F21B",
        "cWhiteGray": "#1B1B1B"
      }
    }
  },

  plugins: []
} satisfies Config;
