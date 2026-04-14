"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/components/ui/profile/ProfileBar";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ── 1. HEADER (sticky, sits above everything) ── */}
      <Header />

      {/* ── 2. BODY (sidebar + main) fills remaining height ── */}
      <div className="flex flex-1 relative overflow-hidden">

        {/* Mobile backdrop overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── SIDEBAR ──
            - Desktop: static in the flex row, always visible
            - Mobile:  fixed, slides in from left over the content
        ── */}
        <aside
          className={`
            fixed top-0 left-0 h-full z-40
            lg:static lg:h-auto lg:z-auto
            transition-transform duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          <ProfileSidebar
            activePath={pathname}
            onClose={() => setMobileOpen(false)}
          />
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 overflow-y-auto">

          {/* Mobile top bar — only visible on small screens */}
          <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-gray-700 truncate">
              Dashboard
            </span>
          </div>

          {/* Page content */}
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* ── 3. FOOTER ── */}
      <Footer />
    </div>
  );
}