"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User, Award, Layers, PlusCircle, Shield, X, ChevronLeft, ChevronRight } from "lucide-react";

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
    items: [
      { label: "My Plans", path: "/nutritionist/plans", icon: Layers },
      { label: "Create Plan", path: "/nutritionist/plans/create", icon: PlusCircle },
      { label: "Programs", path: "/nutritionist/programs", icon: PlusCircle },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Settings", path: "/nutritionist/settings", icon: Shield },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function NutritionistProfileSidebar({ isOpen, onClose, onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onCollapseChange) onCollapseChange(newState);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  return (
    <aside
      className={`
        fixed left-0 z-40
        top-16 lg:top-20 
        h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] 
        bg-white border-r border-gray-100
        transition-all duration-300 ease-in-out flex flex-col
        ${collapsed ? "w-20" : "w-64"}
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Collapse Toggle (Desktop) / Close (Mobile) */}
      <div className="flex items-center justify-between px-6 py-4">
        {!collapsed && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Settings</span>}
        
        <button 
          onClick={isOpen ? onClose : handleToggleCollapse} 
          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"
        >
          {isOpen ? <X size={18} /> : collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
        {menu.map((group) => (
          <div key={group.section} className="mb-6">
            {!collapsed && (
              <h3 className="px-7 text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">
                {group.section}
              </h3>
            )}
            
            <nav className="flex flex-col">
              {group.items.map((item) => {
                const active = pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      group relative flex items-center py-2.5 w-full transition-all
                      ${collapsed ? "justify-center px-0" : "px-7 gap-3.5"}
                      ${active ? "text-emerald-700 bg-emerald-50/30" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"}
                    `}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-600 rounded-r-full" />
                    )}

                    <Icon 
                      size={18} 
                      strokeWidth={active ? 2.5 : 2}
                      className={`transition-colors ${active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`} 
                    />
                    
                    {!collapsed && (
                      <span className={`text-[13px] tracking-tight ${active ? "font-semibold" : "font-medium"}`}>
                        {item.label}
                      </span>
                    )}

                    {/* Desktop Tooltip for Collapsed Mode */}
                    {collapsed && !isOpen && (
                      <div className="absolute left-14 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
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