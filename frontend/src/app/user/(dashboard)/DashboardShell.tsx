"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import ProfileSidebar from "@/components/ui/profile/ProfileSideBar";

const SIDEBAR_ID = "dashboard-sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode; // server-rendered, passed through untouched
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Restore saved preference after mount (avoids hydration mismatch)
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("sidebar-collapsed") === "1");
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("sidebar-collapsed", next ? "1" : "0");
    } catch {}
  };

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative flex flex-1">
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 top-16 z-30 bg-slate-900/50 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id={SIDEBAR_ID}
        className={`fixed left-0 top-16 z-40 h-[calc(100dvh-4rem)] w-56 max-w-[85vw] overflow-hidden border-r border-slate-200 bg-white will-change-transform transition-[transform,width] duration-200 ease-out
          lg:sticky lg:z-10 lg:shrink-0 lg:translate-x-0 ${collapsed ? "lg:w-16" : ""}
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <ProfileSidebar
          activePath={pathname}
          onClose={() => setOpen(false)}
          collapsed={collapsed}
          onToggle={toggleCollapsed}
        />
      </aside>

      <main className="min-w-0 flex-1">
        <div className="sticky top-16 z-20 flex items-center border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls={SIDEBAR_ID}
            className="rounded-lg border border-emerald-100 bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
