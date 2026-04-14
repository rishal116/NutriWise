"use client";

import { useNutritionistGuard } from "@/hooks/nutritionist/useNutritionistGuard";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Search,
  Bell,
  LayoutDashboard,
} from "lucide-react";

export default function NutritionistDashboard() {
  useNutritionistGuard();

  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVars = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      variants={containerVars}
      initial="initial"
      animate="animate"
      className="max-w-7xl mx-auto space-y-10 pb-20 px-4 pt-6"
    >
      {/* --- TOP NAV / HEADER --- */}
      <motion.div
        variants={itemVars}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Management Console
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Nutritionist <span className="text-emerald-600">Dashboard</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden md:block">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search clients..."
              className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all text-sm font-bold w-64"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:shadow-lg hover:shadow-emerald-900/5 transition-all">
            <Bell size={20} />
          </button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 hover:shadow-emerald-100">
            <Plus size={16} strokeWidth={3} />
            New Plan
          </button>
        </div>
      </motion.div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          variants={itemVars}
          icon={<Users size={24} />}
          label="Active Clients"
          value="24"
          trend="+3 this week"
        />
        <StatCard
          variants={itemVars}
          icon={<Calendar size={24} />}
          label="Meetings Today"
          value="08"
          trend="Next: 2:00 PM"
        />
        <StatCard
          variants={itemVars}
          icon={<TrendingUp size={24} />}
          label="Success Rate"
          value="92%"
          trend="Top 5% Expert"
        />
      </div>

      {/* --- PLACEHOLDER CONTENT AREA --- */}
      <motion.div
        variants={itemVars}
        className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center"
      >
        <div className="max-w-xs mx-auto">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <LayoutDashboard className="text-slate-200" size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-800">
            Your Overview Awaits
          </h3>
          <p className="text-sm text-slate-400 font-bold mt-2">
            Start by assigning a program or checking your upcoming appointments.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- SUB-COMPONENT ---

function StatCard({ icon, label, value, trend, variants }: any) {
  return (
    <motion.div
      variants={variants}
      className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
          {value}
        </h4>
      </div>
    </motion.div>
  );
}
