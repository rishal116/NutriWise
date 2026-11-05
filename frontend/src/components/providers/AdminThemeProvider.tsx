"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function AdminThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("nutriwise-admin-theme");

    const theme: Theme =
      savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
        ? savedTheme
        : "system";

    const applyTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      document.documentElement.classList.toggle("dark", isDark);
    };

    applyTheme();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return children;
}
