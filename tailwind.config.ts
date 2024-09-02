import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    theme: {
        extend: {
            colors: {
                "dark-green": "#1f3102",
                "light-green": "#b9f21b"
            }
        }
    },

    plugins: []
} as Config;