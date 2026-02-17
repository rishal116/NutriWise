"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/components/ui/profile/ProfileBar";
import { Menu } from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMessagesPage = pathname.startsWith("/client/messages");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:relative z-40 h-full
            transition-all duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          <ProfileSidebar
            activePath={pathname}
            compact={isMessagesPage}   // 🔥 shrink on messages
            onClose={() => setMobileOpen(false)}
          />
        </div>

        {/* Main Content */}
        <main
          className={`
            flex-1 transition-all duration-300
            ${isMessagesPage
              ? "overflow-hidden p-0"
              : "overflow-y-auto p-6"}
          `}
        >
          {/* Mobile Menu Button */}
          {!isMessagesPage && (
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden mb-4 p-2 bg-white shadow rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {children}
        </main>
      </div>

      {!isMessagesPage && <Footer />}
    </div>
  );
}
