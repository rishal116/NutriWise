"use client";

import { Home, Users, Calendar, MessageSquare, Settings, LogOut } from "lucide-react";

const menu = [
  { label: "Dashboard", icon: Home },
  { label: "Appointments", icon: Calendar },
  { label: "Clients", icon: Users },
  { label: "Messages", icon: MessageSquare },
  { label: "Settings", icon: Settings }
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-5 hidden md:block">
      <h1 className="text-xl font-semibold mb-10">NutriWise</h1>

      <nav className="space-y-2">
        {menu.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-3 mt-10 text-red-600 p-3 hover:bg-red-50 rounded-lg">
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
