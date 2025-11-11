"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  Activity,
  CreditCard,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/nutritionist/dashboard" },
  { name: "Clients", icon: Users, path: "/nutritionist/clients" },
  { name: "Appointments", icon: Stethoscope, path: "/nutritionist/appointments" },
  { name: "Reports", icon: FileText, path: "/nutritionist/reports" },
  { name: "Earnings", icon: CreditCard, path: "/nutritionist/earnings" },
  { name: "Activity", icon: Activity, path: "/nutritionist/activity" },
  { name: "Settings", icon: Settings, path: "/nutritionist/settings" },
];

const NutritionistDashboard = () => {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("/nutritionist/dashboard");

  const stats = [
    { title: "Clients", value: 120 },
    { title: "Appointments", value: 45 },
    { title: "Earnings", value: "$2,450" },
    { title: "Pending Reports", value: 8 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-10">NutriWise</h2>
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left font-medium ${
                  activeNav === item.path
                    ? "bg-emerald-500 text-white"
                    : "text-gray-700 hover:bg-emerald-100"
                }`}
                onClick={() => {
                  setActiveNav(item.path);
                  router.push(item.path);
                }}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Bell size={24} className="text-gray-600 cursor-pointer" />
            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="text-gray-500 font-medium">{stat.title}</p>
              <h2 className="text-2xl font-bold mt-2">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
          <ul className="divide-y divide-gray-200">
            <li className="py-3 flex justify-between">
              <span>New client registered: John Doe</span>
              <span className="text-gray-400">2h ago</span>
            </li>
            <li className="py-3 flex justify-between">
              <span>Appointment confirmed: Jane Smith</span>
              <span className="text-gray-400">4h ago</span>
            </li>
            <li className="py-3 flex justify-between">
              <span>Report submitted: Alex Johnson</span>
              <span className="text-gray-400">1d ago</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default NutritionistDashboard;
