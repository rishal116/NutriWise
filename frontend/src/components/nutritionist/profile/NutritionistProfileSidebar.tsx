"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Award,
  Layers,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  LayoutGrid,
} from "lucide-react";

const menu = [
  {
    section: "Profile",
    items: [
      { label: "Basic Info", path: "/nutritionist/profile", icon: User },
      { label: "Credentials", path: "/nutritionist/credentials", icon: Award },
    ],
  },
  {
    section: "Plans",
    items: [{ label: "My Plans", path: "/nutritionist/plans", icon: Layers }],
  },
  {
    section: "Programs",
    items: [
      { label: "Programs", path: "/nutritionist/programs", icon: LayoutGrid },
    ],
  },
  {
    section: "Group",
    items: [{ label: "Feed", path: "/nutritionist/groups", icon: Users }],
  },
  {
    section: "Account",
    items: [
      { label: "Settings", path: "/nutritionist/settings", icon: Shield },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function NutritionistProfileSidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={`
        fixed left-0 z-40 top-16 h-[calc(100vh-64px)] 
        bg-white border-r border-slate-100 transition-all duration-300 flex flex-col
        ${isCollapsed ? "w-16" : "w-56"}
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="flex items-center justify-end p-3">
        <button
          onClick={isOpen ? onClose : onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"
        >
          {isOpen ? (
            <X size={18} />
          ) : isCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
        {menu.map((group) => (
          <div key={group.section} className="mb-4">
            {!isCollapsed && (
              <h3 className="px-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                {group.section}
              </h3>
            )}
            <nav>
              {group.items.map((item) => {
                const active = pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item.path);
                      onClose();
                    }}
                    className={`
                      group relative flex items-center py-2 w-full transition-all
                      ${isCollapsed ? "justify-center px-0" : "px-6 gap-3"}
                      ${active ? "text-emerald-700 bg-emerald-50/40" : "text-slate-500 hover:bg-slate-50"}
                    `}
                  >
                    {active && (
                      <div className="absolute left-0 w-1 h-4 bg-emerald-500 rounded-r-full" />
                    )}
                    <Icon
                      size={18}
                      className={active ? "text-emerald-600" : "text-slate-400"}
                    />
                    {!isCollapsed && (
                      <span className="text-xs font-medium">{item.label}</span>
                    )}

                    {isCollapsed && !isOpen && (
                      <div className="absolute left-12 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
