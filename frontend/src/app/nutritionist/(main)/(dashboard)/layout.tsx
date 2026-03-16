"use client";

import { useState } from "react";
import NutritionistSidebar from "@/components/nutritionist/NutritionistSidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* MOBILE BREADCRUMB BAR 
          Matches your Profile Layout style. 
          Assumes a global top header exists at top-0 (h-16).
      */}
      <div className="lg:hidden sticky top-16 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-12 flex items-center z-30">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest"
        >
          <Menu size={14} />
          Dashboard Menu
        </button>
      </div>

      <NutritionistSidebar 
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        onCollapseChange={(val) => setIsCollapsed(val)} 
      />
      
      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <main 
        className={`
          flex-1 transition-all duration-300 ease-in-out
          /* pt-4 because the sticky bar handles the top spacing on mobile */
          pt-4 lg:pt-0 
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        <div className="p-4 md:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}