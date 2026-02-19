"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Award,
  Layers,
  PlusCircle,
  Shield,
  ChevronRight,
  X
} from "lucide-react";

const menu = [
  {
    section: "Profile",
    items: [
      {
        label: "Basic Info",
        path: "/nutritionist/profile",
        icon: User,
        description: "Personal & professional details",
      },
      {
        label: "Credentials",
        path: "/nutritionist/credentials",
        icon: Award,
        description: "Certificates & verification",
      },
    ],
  },
  {
    section: "Plans",
    items: [
      {
        label: "My Plans",
        path: "/nutritionist/plans",
        icon: Layers,
        description: "View & manage subscription plans",
      },
      {
        label: "Create Plan",
        path: "/nutritionist/plans/create",
        icon: PlusCircle,
        description: "Add a new subscription plan",
      },
    ],
  },
  {
    section: "Account",
    items: [
      {
        label: "Account Settings",
        path: "/nutritionist/settings",
        icon: Shield,
        description: "Security & payout preferences",
      },
    ],
  },
];




// Add Props type for responsiveness
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}


export default function NutritionistProfileSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (onClose) onClose(); // Close sidebar on mobile after clicking
  };

  return (
    <aside
      className={`
        fixed 
        top-0 lg:top-20 
        left-0 
        h-full lg:h-[calc(100vh-80px)] 
        w-72 
        bg-white 
        border-r 
        border-gray-100 
        flex 
        flex-col 
        z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-end p-4">
        <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Header with Progress Indicator */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-800">Profile Setup</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
            80% DONE
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Complete your profile to start selling.
        </p>
      </div>

      {/* Main Menu - Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-hide">
        {menu.map((group) => (
          <div key={group.section}>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              {group.section}
            </p>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 group
                      ${active ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "hover:bg-slate-50 text-slate-600 active:scale-95"}
                    `}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors
                      ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600"}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${active ? "text-white" : "text-slate-700"}`}>{item.label}</p>
                      <p className={`text-[11px] truncate ${active ? "text-emerald-100" : "text-slate-400"}`}>{item.description}</p>
                    </div>
                    {!active && <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
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