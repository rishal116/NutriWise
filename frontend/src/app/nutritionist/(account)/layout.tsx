"use client";

import { useState } from "react";
import NutritionistProfileSidebar from "@/components/nutritionist/profile/NutritionistProfileSidebar";
import { Menu } from "lucide-react";

export default function NutritionistProfileLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Mobile breadcrumb bar */}
      <div className="lg:hidden sticky top-16 left-0 right-0 bg-white border-b border-gray-100 px-4 h-10 flex items-center z-30">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest"
        >
          <Menu size={14} />
          Settings Menu
        </button>
      </div>

      <NutritionistProfileSidebar 
        isOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
        onCollapseChange={(val) => setIsCollapsed(val)}
      />

      {/* Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content Area - Dynamic Margin */}
      <main 
  className={`
    flex-1 transition-all duration-300 ease-in-out
    /* Dynamic Left Padding based on Sidebar state */
    ${isCollapsed ? "lg:pl-24" : "lg:pl-64"} 
    pt-6 lg:pt-8
  `}
>
  {/* Added 'w-full' to ensure content stretches to the remaining space */}
  <div className="p-4 md:p-8 lg:p-10 max-w-full mx-auto">
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {children}
    </div>
  </div>
</main>
    </div>
  );
}