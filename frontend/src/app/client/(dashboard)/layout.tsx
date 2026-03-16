"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/components/ui/profile/ProfileBar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 1. Header is here */}
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* 2. Sidebar is here */}
        <aside
          className={`
            fixed lg:relative z-40 h-full
            transition-all duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          <ProfileSidebar
            activePath={pathname}
            onClose={() => setMobileOpen(false)}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* Mobile Menu Toggle (Only visible on small screens) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden mb-4 p-2 bg-white shadow-sm border border-emerald-100 rounded-md text-emerald-600"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 3. Footer is here */}
      <Footer />
    </div>
  );
}