"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  BadgeDollarSign,
  Trophy,
  FileText,
  CreditCard,
  MessagesSquare,
  Menu,
  ChevronLeft,
  ChevronDown,
  X,
  LucideIcon,
} from "lucide-react";

import Logo from "../common/Logo";

interface NavChild {
  name: string;
  path: string;
}

interface NavItem {
  name: string;
  icon: LucideIcon;
  path?: string;
  children?: NavChild[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        name: "Users",
        icon: Users,
        path: "/admin/users",
      },
      {
        name: "Nutritionists",
        icon: Stethoscope,
        children: [
          {
            name: "All Nutritionists",
            path: "/admin/nutritionists",
          },
          {
            name: "Applications",
            path: "/admin/nutritionists/applications",
          },
        ],
      },
      {
        name: "Plans",
        icon: BadgeDollarSign,
        path: "/admin/plans",
      },
      {
        name: "Challenges",
        icon: Trophy,
        path: "/admin/challenges",
      },
      {
        name: "Posts",
        icon: FileText,
        path: "/admin/posts",
      },
    ],
  },
  {
    title: "Finance & Community",
    items: [
      {
        name: "Payments",
        icon: CreditCard,
        path: "/admin/payments",
      },
      {
        name: "Communities",
        icon: MessagesSquare,
        path: "/admin/community",
      },
    ],
  },
];

function findInitialOpenGroup(pathname: string): string | null {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.children?.some((child) => pathname.startsWith(child.path))) {
        return item.name;
      }
    }
  }

  return null;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const [openGroup, setOpenGroup] = useState<string | null>(() =>
    findInitialOpenGroup(pathname),
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, setMobileOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-admin-border bg-admin-surface transition-all duration-300 ease-in-out ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-admin-border px-4">
          <div className={collapsed ? "lg:mx-auto" : ""}>
            <Logo size="small" href="/admin/dashboard" showText={!collapsed} />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-admin-muted transition-colors hover:bg-admin-surface-hover hover:text-admin-text lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="scrollbar-hide flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-6">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-1">
                <h3
                  className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-admin-muted ${
                    collapsed ? "lg:hidden" : ""
                  }`}
                >
                  {section.title}
                </h3>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    if (item.children) {
                      const isOpen = openGroup === item.name;

                      const groupActive = item.children.some((child) =>
                        pathname.startsWith(child.path),
                      );

                      return (
                        <div key={item.name}>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenGroup((current) =>
                                current === item.name ? null : item.name,
                              )
                            }
                            aria-expanded={isOpen}
                            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                              collapsed ? "lg:justify-center lg:px-0" : ""
                            } ${
                              groupActive
                                ? "bg-admin-accent-soft text-admin-accent"
                                : "text-admin-muted hover:bg-admin-surface-hover hover:text-admin-text"
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 shrink-0 transition-colors ${
                                groupActive
                                  ? "text-admin-accent"
                                  : "group-hover:text-admin-accent"
                              }`}
                            />

                            <span
                              className={`flex-1 whitespace-nowrap text-left text-sm font-semibold ${
                                collapsed ? "lg:hidden" : ""
                              }`}
                            >
                              {item.name}
                            </span>

                            <ChevronDown
                              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              } ${collapsed ? "lg:hidden" : ""}`}
                            />
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-200 ease-out ${
                              isOpen
                                ? "mt-1 max-h-40 opacity-100"
                                : "max-h-0 opacity-0"
                            } ${collapsed ? "lg:hidden" : ""}`}
                          >
                            <div className="ml-[1.35rem] space-y-0.5 border-l border-admin-border pl-4">
                              {item.children.map((child) => {
                                const childActive = pathname.startsWith(
                                  child.path,
                                );

                                return (
                                  <Link
                                    key={child.path}
                                    href={child.path}
                                    aria-current={
                                      childActive ? "page" : undefined
                                    }
                                    className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                                      childActive
                                        ? "bg-admin-accent-soft font-medium text-admin-accent"
                                        : "text-admin-muted hover:bg-admin-surface-hover hover:text-admin-text"
                                    }`}
                                  >
                                    <span className="truncate">
                                      {child.name}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    const isActive =
                      item.path === pathname ||
                      (item.path !== "/admin/dashboard" &&
                        pathname.startsWith(`${item.path}/`));

                    return (
                      <Link
                        key={item.name}
                        href={item.path!}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                          collapsed ? "lg:justify-center lg:px-0" : ""
                        } ${
                          isActive
                            ? "bg-admin-accent-soft text-admin-accent"
                            : "text-admin-muted hover:bg-admin-surface-hover hover:text-admin-text"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 shrink-0 transition-colors ${
                            isActive
                              ? "text-admin-accent"
                              : "group-hover:text-admin-accent"
                          }`}
                        />

                        <span
                          className={`whitespace-nowrap text-sm font-semibold ${
                            collapsed ? "lg:hidden" : ""
                          }`}
                        >
                          {item.name}
                        </span>

                        {isActive && (
                          <span
                            className={`ml-auto h-4 w-1 rounded-full bg-admin-accent ${
                              collapsed ? "lg:hidden" : ""
                            }`}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Collapse Button */}
        <div className="shrink-0 border-t border-admin-border p-3">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden w-full items-center rounded-xl text-admin-muted transition-all hover:bg-admin-accent-soft hover:text-admin-accent lg:flex ${
              collapsed ? "h-10 justify-center" : "gap-3 px-3 py-2"
            }`}
          >
            {collapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-[18px] w-[18px]" />

                <span className="text-xs font-bold uppercase tracking-wider">
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
