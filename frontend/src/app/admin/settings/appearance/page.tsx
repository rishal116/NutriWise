
"use client";

import { useEffect, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";

const themes: {
  value: Theme;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    value: "light",
    label: "Light",
    description: "A bright appearance for your dashboard.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "A darker appearance that's easier on the eyes.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Automatically follow your device appearance.",
    icon: Monitor,
  },
];

export default function AppearancePage() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("nutriwise-admin-theme");

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      setTheme(savedTheme);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const applyTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" && mediaQuery.matches);

      document
        .getElementById("admin-dashboard")
        ?.classList.toggle("dark", isDark);
    };

    applyTheme();

    if (theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);
    }

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [theme, mounted]);

  const handleThemeChange = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    localStorage.setItem("nutriwise-admin-theme", selectedTheme);
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-admin-text">
          Appearance
        </h1>
        <p className="mt-1 text-sm font-medium text-admin-muted">
          Customize how your NutriWise dashboard looks.
        </p>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-admin-text">
            Theme preference
          </h2>
          <p className="mt-1 text-sm text-admin-muted">
            Select how you want your dashboard to appear.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {themes.map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleThemeChange(item.value)}
                aria-pressed={isSelected}
                className={`relative flex flex-col items-start gap-4 rounded-2xl border p-5 text-left transition-all hover:border-admin-accent ${
                  isSelected
                    ? "border-admin-accent bg-admin-accent/5 ring-2 ring-admin-accent/20"
                    : "border-admin-border bg-admin-surface"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="rounded-xl bg-admin-pastel-purple p-3">
                    <Icon size={22} className="text-admin-accent" />
                  </div>

                  {isSelected && (
                    <Check size={20} className="text-admin-accent" />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-admin-text">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-sm text-admin-muted">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
        <h2 className="font-semibold text-admin-text">
          Current preference
        </h2>
        <p className="mt-1 text-sm text-admin-muted">
          Your dashboard is set to{" "}
          <span className="font-semibold capitalize text-admin-accent">
            {theme}
          </span>{" "}
          mode.
        </p>
      </div>
    </div>
  );
}
