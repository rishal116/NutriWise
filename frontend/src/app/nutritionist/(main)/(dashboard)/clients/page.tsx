"use client";

import { useEffect, useState, useMemo } from "react";
import { nutritionistSubscriptionService } from "@/services/nutritionist/nutritionistSubscription.service";
import { 
  Users, Calendar, DollarSign, Clock, Mail, 
  TrendingUp, Search, CheckCircle2, RotateCcw, Filter, X, ArrowUpRight
} from "lucide-react";
import { useNutritionistGuard } from "@/hooks/nutritionist/useNutritionistGuard";
import { motion, AnimatePresence } from "framer-motion";

export const SUBSCRIPTION_STATUS = ["ACTIVE", "UPCOMING", "PENDING", "EXPIRED", "CANCELLED"] as const;
type StatusType = (typeof SUBSCRIPTION_STATUS)[number] | "ALL";

export default function NutritionistClient() {
  useNutritionistGuard();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StatusType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchSubscriptions(); }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await nutritionistSubscriptionService.getSubscriptions();
      setSubscriptions(res.data || []);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const filteredSubscriptions = useMemo(() => {
    return (subscriptions || []).filter((sub) => {
      const matchesTab = activeTab === "ALL" || sub.status === activeTab;
      const searchLower = searchQuery.toLowerCase();
      return matchesTab && (
        sub.user.name.toLowerCase().includes(searchLower) ||
        sub.user.email.toLowerCase().includes(searchLower)
      );
    });
  }, [subscriptions, activeTab, searchQuery]);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#fcfdfc] pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- STATS OVERVIEW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Network" value={subscriptions.length} icon={<Users size={20}/>} color="emerald" />
          <StatCard title="Active Plans" value={subscriptions.filter(s => s.status === "ACTIVE").length} icon={<CheckCircle2 size={20}/>} color="teal" />
          <StatCard title="Gross Revenue" value={`₹${subscriptions.reduce((sum, s) => sum + s.plan.price, 0).toLocaleString()}`} icon={<DollarSign size={20}/>} color="slate" />
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <div className="sticky top-20 z-20 bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] border border-emerald-50 shadow-xl shadow-emerald-900/5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {["ALL", ...SUBSCRIPTION_STATUS].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status as any)}
                  className={`px-5 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap border ${
                    activeTab === status 
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" 
                      : "bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-600"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- TABLE CONTENT --- */}
        <div className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/30">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/50">Client Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/50">Plan Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/50">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/50 text-right">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/50">
                <AnimatePresence mode="popLayout">
                  {filteredSubscriptions.map((sub) => (
                    <motion.tr 
                      layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={sub.id} className="group hover:bg-emerald-50/20 transition-all cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-200">
                            {sub.user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-sm">{sub.user.name}</div>
                            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{sub.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-800 text-sm">{sub.plan.title}</div>
                        <div className="text-[10px] font-black text-emerald-600 uppercase mt-0.5">{sub.plan.durationInDays} Days</div>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="font-black text-slate-900">₹{sub.plan.price.toLocaleString()}</div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm group hover:border-emerald-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-emerald-50 text-emerald-600`}>{icon}</div>
        <ArrowUpRight size={16} className="text-slate-200 group-hover:text-emerald-400 transition-colors" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100",
    EXPIRED: "bg-rose-50 text-rose-700 border-rose-100",
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    CANCELLED: "bg-slate-50 text-slate-500 border-slate-100",
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.CANCELLED}`}>
      {status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfdfc]">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
      <p className="mt-4 text-[10px] font-black text-emerald-800 uppercase tracking-[0.4em]">Syncing Roster</p>
    </div>
  );
}