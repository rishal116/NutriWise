"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import NutritionistSidebar from "@/components/nutritionist/NutritionistSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleCollapseChange = useCallback((val: boolean) => {
    setIsCollapsed(val);
  }, []);

  const handleMobileClose = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="sticky top-16 z-30 flex h-12 items-center border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md lg:hidden">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600"
        >
          <Menu size={14} />
          Dashboard Menu
        </button>
      </div>

      <NutritionistSidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={handleMobileClose}
        onCollapseChange={handleCollapseChange}
      />

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={handleMobileClose}
        />
      )}

      <main
        className={`transition-all duration-300 ease-in-out pb-20 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="p-4 md:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
