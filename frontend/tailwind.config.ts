import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "admin-bg": "var(--admin-bg)",
        "admin-surface": "var(--admin-surface)",
        "admin-surface-hover": "var(--admin-surface-hover)",
        "admin-border": "var(--admin-border)",
        "admin-text": "var(--admin-text)",
        "admin-muted": "var(--admin-text-muted)",
        "admin-accent": "var(--admin-accent)",
        "admin-accent-hover": "var(--admin-accent-hover)",
        "admin-accent-soft": "var(--admin-accent-soft)",
        "admin-accent-fg": "var(--admin-accent-foreground)",
        "admin-danger": "var(--admin-danger)",
        "admin-danger-soft": "var(--admin-danger-soft)",
      },
    },
  },
  plugins: [],
};

export default config;