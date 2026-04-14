"use client";

import React from "react";
import { Users, Stethoscope, CreditCard, Activity, ArrowUpRight } from "lucide-react";

const stats = [
  { name: "Total Users", value: "2,543", icon: Users, change: "+12.5%", color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Nutritionists", value: "84", icon: Stethoscope, change: "+3.2%", color: "text-emerald-600", bg: "bg-emerald-50" },
  { name: "Total Revenue", value: "$12,450", icon: CreditCard, change: "+18.7%", color: "text-amber-600", bg: "bg-amber-50" },
  { name: "Active Challenges", value: "12", icon: Activity, change: "+2", color: "text-purple-600", bg: "bg-purple-50" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 font-medium">Welcome back! Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.name} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {item.change}
                <ArrowUpRight size={12} className="ml-1" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{item.name}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts/Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white h-[400px] rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
          <p className="text-slate-400 text-sm font-medium italic">Activity Chart Placeholder</p>
        </div>
        <div className="bg-white h-[400px] rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
          <p className="text-slate-400 text-sm font-medium italic">Recent Notifications Placeholder</p>
        </div>
      </div>
    </div>
  );
}