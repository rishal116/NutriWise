"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/user/Header";
import Footer from "@/components/user/Footer";
import ProfileSidebar from "@/components/ui/profile/ProfileBar";
import { Menu, X } from "lucide-react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const isMessagesPage =
    pathname === "/account/messages" ||
    pathname.startsWith("/account/messages");

  // Handle screen resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:static z-50 lg:z-auto
            h-full transition-transform duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
<ProfileSidebar
  compact={isMessagesPage && isLargeScreen}
  activePath={pathname}
  onClose={() => setMobileOpen(false)}
  disableScroll={isMessagesPage}
/>
        </div>

        {/* Main Content */}
        <main
          className={`
            flex-1 w-full overflow-y-auto transition-all duration-300
            ${isMessagesPage ? "p-0" : "p-4 sm:p-6 lg:p-8"}
          `}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden mb-4 p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex items-center gap-2"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Menu</span>
          </button>

          {children}
        </main>
      </div>

      {!isMessagesPage && <Footer />}
    </div>
  );
}