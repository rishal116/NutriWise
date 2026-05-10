"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Trophy,
  FileText,
  CreditCard,
  MessageSquare,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  LucideIcon,
} from "lucide-react";
import { adminAuthService } from "@/services/admin/adminAuth.service";
import ANutriWiseLogo from "@/components/layout/ANutriwiselogo";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavChild {
  name: string;
  path: string;
}

interface NavItem {
  name: string;
  icon: LucideIcon;
  path: string;
  children?: NavChild[]; // ✅ Fix 1: children added to NavItem interface
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

// ─── Nav Data ─────────────────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Users", icon: Users, path: "/admin/users" },
      {
        name: "Nutritionists",
        icon: Stethoscope,
        path: "/admin/nutritionists",
        children: [
          { name: "All Nutritionists", path: "/admin/nutritionists" },
          { name: "Applications", path: "/admin/nutritionists/applications" },
        ],
      },
      { name: "Challenges", icon: Trophy, path: "/admin/challenges" },
      { name: "Posts", icon: FileText, path: "/admin/posts" },
    ],
  },
  {
    title: "Finance & Community",
    items: [
      { name: "Payments", icon: CreditCard, path: "/admin/payments" },
      { name: "Community", icon: MessageSquare, path: "/admin/community" },
    ],
  },
];

// ─── Sidebar Content ──────────────────────────────────────────────────────────

function SidebarContent({
  collapsed,
  setCollapsed,
  onNavClick,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  onNavClick?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropup, setShowDropup] = useState(false);

  // ✅ Fix 2: track which parent items are expanded for children
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    () => {
      // Auto-expand if a child path is currently active
      const initial: Record<string, boolean> = {};
      for (const section of NAV_SECTIONS) {
        for (const item of section.items) {
          if (item.children?.some((c) => pathname.startsWith(c.path))) {
            initial[item.name] = true;
          }
        }
      }
      return initial;
    }
  );

  const dropupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropupRef.current && !dropupRef.current.contains(e.target as Node)) {
        setShowDropup(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    onNavClick?.();
  };

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div
        className={`h-16 flex items-center border-b border-slate-100/80 shrink-0 transition-all duration-300 ${
          collapsed ? "justify-center px-4" : "px-5"
        }`}
      >
        {collapsed ? (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #0d9488, #065f46)",
              boxShadow: "0 4px 14px rgba(13,148,136,0.4)",
            }}
            onClick={() => navigate("/admin/dashboard")}
            role="button"
            aria-label="Go to dashboard"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 2C7 2 3 6.5 3 10c0 5 4 9 9 9s9-4 9-9c0-3.5-4-8-9-8z"
                fill="rgba(255,255,255,0.15)"
              />
              <path
                d="M12 2c0 0-1 5 2 9s7 5 7 5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M12 2C12 2 9 7 8 11s1 8 1 8"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : (
          <ANutriWiseLogo />
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto scrollbar-hide">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {section.title}
              </p>
            )}
            {collapsed && <div className="mx-3 mb-2 h-px bg-slate-100" />}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = !!item.children?.length;
                const isExpanded = expandedItems[item.name] ?? false;

                // Active if exact match OR any child path matches
                const isActive =
                  pathname === item.path ||
                  (!hasChildren && pathname.startsWith(item.path + "/"));

                // Parent is "highlighted" when a child is active
                const isParentHighlighted =
                  hasChildren &&
                  item.children!.some((c) => pathname === c.path);

                return (
                  <div key={item.name}>
                    {/* ── Parent nav button ── */}
                    <button
                      onClick={() => {
                        if (hasChildren && !collapsed) {
                          toggleExpand(item.name);
                        } else {
                          navigate(item.path);
                        }
                      }}
                      title={collapsed ? item.name : undefined}
                      className={`w-full flex items-center rounded-xl transition-all duration-200 group
                        ${collapsed ? "justify-center h-11 w-11 mx-auto" : "px-3 py-2.5 gap-3"}
                        ${
                          isActive || isParentHighlighted
                            ? "bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                    >
                      <Icon
                        className={`shrink-0 transition-colors ${
                          collapsed ? "w-[18px] h-[18px]" : "w-[17px] h-[17px]"
                        } ${
                          isActive || isParentHighlighted
                            ? "text-teal-600"
                            : "group-hover:text-teal-500"
                        }`}
                        strokeWidth={isActive || isParentHighlighted ? 2.2 : 1.8}
                      />

                      {!collapsed && (
                        <>
                          <span className="text-[13px] font-semibold whitespace-nowrap flex-1 text-left">
                            {item.name}
                          </span>

                          {/* Chevron for expandable items */}
                          {hasChildren ? (
                            <ChevronDown
                              size={14}
                              strokeWidth={2}
                              className={`text-slate-400 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          ) : (
                            isActive && (
                              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-400 to-emerald-500" />
                            )
                          )}
                        </>
                      )}
                    </button>

                    {/* ── Children (Fix 2: render children when expanded) ── */}
                    {hasChildren && !collapsed && isExpanded && (
                      <div className="mt-0.5 ml-4 pl-4 border-l-2 border-slate-100 space-y-0.5">
                        {item.children!.map((child) => {
                          const isChildActive = pathname === child.path;
                          return (
                            <button
                              key={child.path}
                              onClick={() => navigate(child.path)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all duration-150
                                ${
                                  isChildActive
                                    ? "text-teal-700 bg-teal-50"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                            >
                              {/* Small dot indicator */}
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                                  isChildActive
                                    ? "bg-teal-500"
                                    : "bg-slate-300"
                                }`}
                              />
                              {child.name}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* ── Collapsed children: tooltip on hover is handled by title; no nested drawer needed ── */}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="p-3 border-t border-slate-100 space-y-2 shrink-0">
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden lg:flex w-full items-center text-slate-400 hover:text-teal-600 hover:bg-teal-50/60 rounded-xl transition-all duration-200
            ${collapsed ? "justify-center h-10" : "px-3 py-2 gap-2.5"}`}
        >
          {collapsed ? (
            <ChevronRight size={17} strokeWidth={2} />
          ) : (
            <>
              <ChevronLeft size={17} strokeWidth={2} />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Collapse
              </span>
            </>
          )}
        </button>

        {/* User dropup */}
        <div ref={dropupRef} className="relative">
          <button
            onClick={() => setShowDropup(!showDropup)}
            className={`w-full flex items-center rounded-xl transition-all duration-200 border
              ${
                collapsed
                  ? "justify-center h-12 border-transparent hover:border-slate-200 hover:bg-slate-50"
                  : "p-2.5 gap-3 bg-slate-50/80 border-slate-100 hover:border-teal-200 hover:bg-teal-50/30"
              }`}
          >
            <div
              className="w-8 h-8 text-white rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #0d9488, #065f46)",
              }}
            >
              AD
            </div>
            {!collapsed && (
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-[12px] font-bold text-slate-800 truncate leading-none">
                  Super Admin
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  admin@nutriwise.com
                </p>
              </div>
            )}
          </button>

          {showDropup && (
            <div
              className={`absolute bottom-full mb-2 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-slate-100 p-1.5 z-50
                ${collapsed ? "left-full ml-2 w-44" : "left-0 w-full"}`}
            >
              <button
                onClick={() => {
                  navigate("/admin/profile");
                  setShowDropup(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-xl text-[12px] font-semibold text-slate-700 transition-colors"
              >
                <User size={14} strokeWidth={1.8} />
                Profile
              </button>
              <div className="h-px bg-slate-100 my-1 mx-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 rounded-xl text-[12px] font-semibold text-red-500 transition-colors"
              >
                <LogOut size={14} strokeWidth={1.8} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Shell ────────────────────────────────────────────────────────────

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white/90 backdrop-blur-xl border-r border-slate-100 flex-col z-50 transition-all duration-300 ease-in-out hidden lg:flex
          ${collapsed ? "w-20" : "w-64"}`}
        style={{ boxShadow: "2px 0 20px rgba(13,148,136,0.04)" }}
      >
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* ── Mobile: backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Mobile: drawer ── */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white flex-col z-50 transition-transform duration-300 ease-in-out lg:hidden flex
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ boxShadow: "4px 0 30px rgba(0,0,0,0.12)" }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

        <SidebarContent
          collapsed={false}
          setCollapsed={setCollapsed}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
}