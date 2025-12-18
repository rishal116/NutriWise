"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Award,
  Layers,
  PlusCircle,
  Shield,
  ChevronRight,
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

export default function NutritionistProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className="
        fixed
        top-20
        left-0
        h-[calc(100vh-80px)]
        w-72
        bg-white
        border-r
        border-gray-100
        p-4
        overflow-y-auto
        z-40
      "
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          Profile Setup
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Manage your profile & subscription plans
        </p>
      </div>

      {/* Menu */}
      {menu.map((group) => (
        <div key={group.section} className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
            {group.section}
          </p>

          <nav className="space-y-1">
            {group.items.map((item) => {
              const active = pathname === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-xl
                    text-left
                    transition-all
                    duration-300
                    group
                    ${
                      active
                        ? "bg-emerald-600 text-white shadow-md"
                        : "hover:bg-emerald-50 text-gray-700"
                    }
                  `}
                >
                  <div
                    className={`
                      flex
                      items-center
                      justify-center
                      w-9
                      h-9
                      rounded-lg
                      ${
                        active
                          ? "bg-white/20"
                          : "bg-emerald-100 group-hover:bg-emerald-200"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        active ? "text-white" : "text-emerald-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">
                      {item.label}
                    </p>
                    <p
                      className={`text-xs ${
                        active
                          ? "text-emerald-100"
                          : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {!active && (
                    <ChevronRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      ))}
    </aside>
  );
}
