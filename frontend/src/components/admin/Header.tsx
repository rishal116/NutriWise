"use client";

import { useState, useRef, useEffect } from "react";
import type { User as UserType } from "@/types/user/user.types";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { userAuthService } from "@/services/user/userAuth.service";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "System overview & analytics" },
  users: { title: "Users", subtitle: "Member management" },
  nutritionists: { title: "Nutritionists", subtitle: "Verified professionals" },
  challenges: { title: "Challenges", subtitle: "Active health programs" },
  posts: { title: "Posts", subtitle: "Community content" },
  payments: { title: "Payments", subtitle: "Transaction history" },
  settings: { title: "Settings", subtitle: "System configuration" },
  community: { title: "Community", subtitle: "Engagement metrics" },
  notifications: { title: "Notifications", subtitle: "Recent alerts" },
  profile: { title: "Profile", subtitle: "Personal settings" },
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const section = pathname.split("/")[2];
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  const currentPage = PAGE_TITLES[section] || {
    title: "Admin Panel",
    subtitle: "NutriWise Administration",
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userAuthService.getMe();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  const initials =
    user?.fullName
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AD";

  const handleLogout = async () => {
    try {
      await userAuthService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-admin-surface/80 backdrop-blur-md border-b border-admin-border">
      <div className="flex justify-between items-center px-4 md:px-6 h-16">
        {/* Left: mobile trigger + brand + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="lg:hidden p-2 -ml-1 text-admin-muted hover:text-admin-text hover:bg-admin-surface-hover rounded-lg transition-colors shrink-0"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:block min-w-0">
            <h1 className="text-sm font-bold text-admin-text tracking-tight truncate">
              {currentPage.title}
            </h1>
            <p className="text-[10px] text-admin-muted font-medium uppercase tracking-wider truncate">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-px h-6 bg-admin-border mx-1 hidden sm:block" />

          {/* Profile */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              aria-haspopup="true"
              aria-expanded={open}
              className="flex items-center gap-2 pl-1 pr-1.5 sm:pr-2 py-1 rounded-lg hover:bg-admin-surface-hover transition-colors"
            >
              <div className="w-8 h-8 bg-admin-accent text-admin-accent-fg rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0">
                {initials}
              </div>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-xs font-bold text-admin-text">
                  {user?.fullName ?? "Loading..."}
                </span>
                <span className="text-[10px] text-admin-muted uppercase">
                  {user?.activeRole ?? ""}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`hidden sm:block text-admin-muted transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute right-0 mt-2 w-52 bg-admin-surface border border-admin-border rounded-xl shadow-xl overflow-hidden origin-top-right transition-all duration-150 ease-out ${
                open
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="py-1.5">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-admin-text hover:bg-admin-surface-hover transition-colors">
                  <User size={15} className="text-admin-muted" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-admin-text hover:bg-admin-surface-hover transition-colors">
                  <Settings size={15} className="text-admin-muted" />
                  Settings
                </button>
              </div>
              <div className="border-t border-admin-border py-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
