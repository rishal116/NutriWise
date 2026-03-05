"use client";

import { useEffect, useState } from "react";
import { nutritionistSubscriptionService } from "@/services/nutritionist/nutritionistSubscription.service";
import { 
  Users, Calendar, DollarSign, Clock, Mail, 
  TrendingUp, Search, CheckCircle2 
} from "lucide-react";
import { useNutritionistGuard } from "@/hooks/nutritionist/useNutritionistGuard";
import { motion, AnimatePresence } from "framer-motion";

interface NutritionistSubscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    title: string;
    price: number;
    durationInDays: number;
  };
}

export default function NutritionistClient() {
  useNutritionistGuard();
  const [subscriptions, setSubscriptions] = useState<NutritionistSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "EXPIRED">("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await nutritionistSubscriptionService.getSubscriptions();
      setSubscriptions(res.data || []);
    } catch (error) {
      console.error("Failed to fetch nutritionist subscriptions", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = (subscriptions || []).filter((sub) => {
    const matchesFilter = filter === "ALL" || sub.status === filter;
    const matchesSearch = 
      sub.user.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.user.email.toLowerCase().includes(search.toLowerCase()) ||
      sub.plan.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === "ACTIVE").length,
    expired: subscriptions.filter(s => s.status === "EXPIRED").length,
    revenue: subscriptions.reduce((sum, s) => sum + s.plan.price, 0),
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#f8faf9] p-4 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Management Console</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Client <span className="text-emerald-600">Roster</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Tracking {stats.active} active consultations today.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-900/5">
             <TrendingUp size={18} className="text-emerald-600" />
             <span className="text-emerald-700 font-bold text-sm">Growth: +12% this month</span>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Network", val: stats.total, icon: Users, color: "from-emerald-500 to-teal-600" },
            { label: "Active Plans", val: stats.active, icon: CheckCircle2, color: "from-emerald-400 to-emerald-600" },
            { label: "Grace Period", val: stats.expired, icon: Clock, color: "from-slate-500 to-slate-700" },
            { label: "Total Earnings", val: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "from-teal-600 to-cyan-700" },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[2rem] p-6 shadow-sm border border-emerald-50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-[0.03] -mr-8 -mt-8 rounded-full`} />
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform`}>
                <item.icon className="text-white" size={22} />
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{item.val}</p>
            </motion.div>
          ))}
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-emerald-50 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/30 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-emerald-50/20 border-2 border-transparent focus:border-emerald-100 rounded-[1.8rem] focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-gray-700 placeholder:text-gray-300"
            />
          </div>
          
          <div className="flex p-1.5 bg-emerald-50/50 rounded-[1.8rem] w-full lg:w-auto">
            {["ALL", "ACTIVE", "EXPIRED"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t as any)}
                className={`flex-1 lg:flex-none px-8 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${
                  filter === t 
                  ? "bg-white text-emerald-700 shadow-lg shadow-emerald-900/5" 
                  : "text-emerald-600/40 hover:text-emerald-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-emerald-50 overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/30">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/40">Client Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/40">Program Type</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/40">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/40">Timeline</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/40 text-right">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/50">
                <AnimatePresence mode="popLayout">
                  {filteredSubscriptions.map((sub) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={sub.id} 
                      className="group hover:bg-emerald-50/20 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg shadow-slate-100 group-hover:bg-emerald-600 transition-colors">
                            {sub.user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 text-sm tracking-tight">{sub.user.name}</div>
                            <div className="text-[11px] text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                              <Mail size={12} className="text-emerald-500/50" /> {sub.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-800">{sub.plan.title}</div>
                        <div className="text-[10px] font-black text-emerald-600/50 uppercase tracking-tighter">{sub.plan.durationInDays} Day Protocol</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                          sub.status === "ACTIVE" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-gray-50 text-gray-400 border-gray-100"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-emerald-50/50 rounded-xl text-emerald-600">
                              <Calendar size={14} />
                           </div>
                           <div>
                              <div className="text-xs font-black text-gray-700">
                                {new Date(sub.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                              </div>
                              <div className="text-[9px] font-black text-gray-300 uppercase">Until {new Date(sub.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="font-black text-gray-900">₹{sub.plan.price.toLocaleString()}</div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredSubscriptions.length === 0 && <EmptyState search={search} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-[10px] font-black text-emerald-800 uppercase tracking-[0.4em] animate-pulse">Syncing Database</p>
      </div>
    </div>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-emerald-50 rounded-[3rem] flex items-center justify-center mb-6">
         <Users className="text-emerald-100" size={40} />
      </div>
      <h3 className="text-xl font-black text-gray-900 tracking-tight">
        {search ? `No results for "${search}"` : "Database Empty"}
      </h3>
      <p className="text-gray-400 text-sm font-medium mt-2 max-w-[240px]">
        Try adjusting your filters or checking for typos in the client name.
      </p>
    </div>
  );
}