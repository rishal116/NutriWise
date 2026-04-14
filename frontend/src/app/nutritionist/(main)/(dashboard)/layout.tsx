"use client";

import { useState } from "react";
import NutritionistSidebar from "@/components/nutritionist/NutritionistSidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    // min-h-[calc(100vh-5rem)] ensures the background fills the screen minus the header height
    <div className="flex flex-col min-h-screen bg-[#fcfdfc]">
      
      {/* MOBILE BREADCRUMB BAR 
          Changed top-16 to match your Header's h-16 
      */}
      <div className="lg:hidden sticky top-16 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-emerald-50 px-4 h-12 flex items-center z-30">
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
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA:
          1. Removed flex-1 (already handled by outer min-h-screen)
          2. Added lg:pt-0 and ensured the transition is smooth.
      */}
      <main 
        className={`
          transition-all duration-300 ease-in-out
          pb-20
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        {/* Container Padding:
            We use p-6 lg:p-10 to give the emerald cards breathing room.
            max-w-7xl matches your Header's width for perfect alignment.
        */}
        <div className="p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}