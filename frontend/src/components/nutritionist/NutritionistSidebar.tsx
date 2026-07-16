"use client";
import { useState, useEffect } from "react";
import {
  Home,
  Video,
  Users,
  FileText,
  Globe,
  Mail,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const menu = [
  {
    label: "Dashboard",
    href: "/nutritionist/dashboard",
    icon: Home,
  },
  {
    label: "Live Sessions",
    href: "/nutritionist/sessions",
    icon: Video,
  },
  {
    label: "My Clients",
    href: "/nutritionist/clients",
    icon: Users,
  },
  {
    label: "Nutrition Plans",
    href: "/nutritionist/plans",
    icon: FileText,
  },
  {
    label: "Communities",
    href: "/nutritionist/communities",
    icon: Globe,
  },
  {
    label: "Messages",
    href: "/nutritionist/messages",
    icon: Mail,
  },
  {
    label: "Earnings",
    href: "/nutritionist/earnings",
    icon: DollarSign,
  },
  {
    label: "Settings",
    href: "/nutritionist/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function NutritionistSidebar({
  isMobileOpen,
  onMobileClose,
  onCollapseChange,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/nutritionist/messages")) {
      setCollapsed(true);
      onCollapseChange?.(true);
    }
  }, [pathname, onCollapseChange]);

  useEffect(() => {
    onMobileClose?.();
  }, [pathname, onMobileClose]);

  const handleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapseChange?.(newState);
  };

  return (
    <aside
      className={`
        fixed left-0 z-[50] lg:z-30
        top-16
        h-[calc(100vh-64px)]
        bg-white border-r border-slate-100
        transition-all duration-300 ease-in-out flex flex-col
        ${collapsed ? "w-20" : "w-64"}
        ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}
    >
      {/* Sidebar Header */}
      <div className="h-14 lg:h-16 flex items-center justify-between px-6 border-b border-slate-50">
        {!collapsed && (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Navigation
          </span>
        )}

        {/* Desktop Collapse / Mobile Close */}
        <button
          onClick={isMobileOpen ? onMobileClose : handleCollapse}
          className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
        >
          {isMobileOpen ? (
            <X size={18} />
          ) : collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {menu.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`
                group relative flex items-center py-2.5 w-full rounded-xl transition-all
                ${collapsed ? "justify-center" : "px-4 gap-3.5"}
                ${isActive ? "text-emerald-700 bg-emerald-50/50" : "text-slate-500 hover:bg-slate-50"}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-600 rounded-r-full" />
              )}

              <div className="relative">
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={
                    isActive
                      ? "text-emerald-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }
                />
              </div>

              {!collapsed && (
                <span
                  className={`text-[13px] tracking-tight ${isActive ? "font-semibold" : "font-medium"}`}
                >
                  {label}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-16 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
