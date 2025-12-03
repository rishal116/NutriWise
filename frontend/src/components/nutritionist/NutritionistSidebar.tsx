"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  Activity,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/nutritionist/dashboard" },
  { name: "Clients", icon: Users, path: "/nutritionist/clients" },
  { name: "Appointments", icon: Stethoscope, path: "/nutritionist/appointments" },
  { name: "Reports", icon: FileText, path: "/nutritionist/reports" },
  { name: "Earnings", icon: CreditCard, path: "/nutritionist/earnings" },
  { name: "Activity", icon: Activity, path: "/nutritionist/activity" },
  { name: "Settings", icon: Settings, path: "/nutritionist/settings" },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 flex flex-col">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-10">NutriWise</h2>

        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                key={item.name}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left font-medium ${
                  active
                    ? "bg-emerald-500 text-white"
                    : "text-gray-700 hover:bg-emerald-100"
                }`}
                onClick={() => router.push(item.path)}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-6 pb-6">
        <button
          className="flex items-center gap-2 px-4 py-3 rounded-xl w-full text-left
          text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
          onClick={() => console.log("logout")}
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
