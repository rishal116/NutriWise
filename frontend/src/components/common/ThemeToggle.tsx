"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className="w-9 h-9 rounded-lg bg-admin-surface-hover animate-pulse" />
    );

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative w-9 h-9 rounded-lg flex items-center justify-center text-admin-muted hover:bg-admin-surface-hover hover:text-admin-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent"
    >
      <Sun
        className={`w-4.5 h-4.5 absolute transition-all ${isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`}
      />
      <Moon
        className={`w-4.5 h-4.5 absolute transition-all ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}
      />
    </button>
  );
}
