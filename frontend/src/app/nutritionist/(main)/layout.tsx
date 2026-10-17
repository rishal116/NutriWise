"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";

import NutritionistHeader from "@/components/nutritionist/NutritionistHeader";
import NutritionistSidebar from "@/components/nutritionist/NutritionistSidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMobileClose = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <NutritionistHeader />

      <div className="sticky top-16 z-30 flex h-12 items-center border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open dashboard menu"
          className="-ml-2 flex h-full items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 transition-colors duration-150 hover:text-emerald-800"
        >
          <Menu size={16} />
          Dashboard Menu
        </button>
      </div>

      <NutritionistSidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={handleMobileClose}
        onCollapseChange={setIsCollapsed}
      />

      {isMobileOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={handleMobileClose}
        />
      )}

      <main
        className={`min-w-0 flex-1 px-4 py-6 transition-[margin] duration-300 ease-in-out sm:px-6 lg:px-8 lg:py-8 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
