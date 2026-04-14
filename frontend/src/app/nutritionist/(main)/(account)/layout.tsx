"use client";

import { useState } from "react";
import NutritionistProfileSidebar from "@/components/nutritionist/profile/NutritionistProfileSidebar";
import { Menu } from "lucide-react";

export default function NutritionistProfileLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Mobile Breadcrumb */}
      <div className="lg:hidden sticky top-16 left-0 right-0 bg-white border-b border-slate-100 px-4 h-12 flex items-center z-30">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest"
        >
          <Menu size={16} />
          Menu
        </button>
      </div>

      <NutritionistProfileSidebar 
        isOpen={isMobileOpen} 
        isCollapsed={isCollapsed}
        onClose={() => setIsMobileOpen(false)} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-30 lg:hidden transition-all"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main 
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isCollapsed ? "lg:pl-16" : "lg:pl-56"} 
          pt-4 lg:pt-8
        `}
      >
        <div className="p-4 md:p-8 max-w-5xl">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}