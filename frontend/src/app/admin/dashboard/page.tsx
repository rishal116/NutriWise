"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  DollarSign,
  Video,
  LogOut,
  Settings,
  MessageCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-white shadow-md rounded-2xl p-5 border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-teal-600">NutriWise</h1>
          <p className="text-gray-500 text-sm mt-1">Nutritionist Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h2 className="font-semibold text-gray-800">Dr. Amelia Harper</h2>
            <p className="text-sm text-gray-500">Nutritionist</p>
          </div>
          <img
            src="https://randomuser.me/api/portraits/women/68.jpg"
            alt="Dr. Amelia Harper"
            className="w-12 h-12 rounded-full border-2 border-teal-400"
          />
        </div>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<CalendarDays className="text-teal-600" size={24} />}
          title="Appointments"
          value="15"
        />
        <StatCard
          icon={<Video className="text-emerald-600" size={24} />}
          title="Live Sessions"
          value="3"
        />
        <StatCard
          icon={<Users className="text-teal-500" size={24} />}
          title="Active Clients"
          value="2"
        />
        <StatCard
          icon={<DollarSign className="text-green-600" size={24} />}
          title="Earnings This Month"
          value="$2,500"
        />
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarDays className="text-teal-500" /> Today's Appointments
          </h3>
          <ul className="space-y-3">
            {[
              { name: "Sophia Bennett", time: "10:00 AM - 11:00 AM" },
              { name: "Ethan Carter", time: "11:30 AM - 12:30 PM" },
              { name: "Olivia Davis", time: "2:00 PM - 3:00 PM" },
            ].map((a, i) => (
              <li
                key={i}
                className="p-3 border rounded-xl hover:bg-teal-50 transition flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-700">{a.name}</p>
                  <p className="text-sm text-gray-500">{a.time}</p>
                </div>
                <button className="bg-teal-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-teal-600 transition">
                  Start
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Live Sessions */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Video className="text-emerald-500" /> Upcoming Live Sessions
          </h3>
          <div className="space-y-4">
            {[
              {
                title: "Weight Loss Workshop",
                date: "10/15/2024",
                time: "10:00 AM - 11:00 AM",
              },
              {
                title: "Healthy Eating Habits",
                date: "10/16/2024",
                time: "11:30 AM - 12:30 PM",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="p-4 border rounded-xl hover:bg-emerald-50 transition"
              >
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">
                    Live
                  </span>{" "}
                  {s.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {s.date} · {s.time} · 1hr
                </p>
                <button className="mt-3 bg-emerald-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-emerald-600 transition">
                  Join Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="text-green-600" /> Earnings Overview
          </h3>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">$2,500</h2>
            <p className="text-gray-500 text-sm">This Month</p>
            <p className="text-green-500 text-sm mt-1">+15%</p>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-4">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="flex justify-end mt-10 gap-4">
        <button
          onClick={() => router.push("/admin/settings")}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          <Settings size={18} /> Settings
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </section>
    </div>
  );
}

// 📊 Stat Card Component
function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center gap-4 hover:shadow-lg transition">
      <div className="p-3 bg-teal-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
