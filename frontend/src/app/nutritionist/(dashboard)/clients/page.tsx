"use client";

import { useEffect, useState } from "react";
import { nutritionistSubscriptionService } from "@/services/nutritionist/nutritionistSubscription.service";
import { 
  Users, Calendar, DollarSign, Clock, Mail, 
  User, TrendingUp, Search, ArrowUpRight, CheckCircle2 
} from "lucide-react";
import { useNutritionistGuard } from "@/hooks/nutritionist/useNutritionistGuard";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-emerald-800 font-bold animate-pulse">Syncing client data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] p-4 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Client <span className="text-emerald-600">Roster</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Tracking {stats.active} active consultations today.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
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
            <div key={idx} className="group bg-white rounded-[2rem] p-6 shadow-sm border border-emerald-50 hover:shadow-xl hover:shadow-emerald-50 transition-all duration-300 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-[0.03] -mr-8 -mt-8 rounded-full`} />
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100`}>
                <item.icon className="text-white" size={22} />
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{item.label}</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{item.val}</p>
            </div>
          ))}
        </div>

        {/* --- SEARCH & ACTIONS --- */}
        <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-emerald-50 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/50" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-emerald-50/30 border-none rounded-[1.8rem] focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-700"
            />
          </div>
          
          <div className="flex p-1.5 bg-emerald-50/50 rounded-[1.8rem] w-full lg:w-auto">
            {["ALL", "ACTIVE", "EXPIRED"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t as any)}
                className={`flex-1 lg:flex-none px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all ${
                  filter === t 
                  ? "bg-white text-emerald-700 shadow-sm" 
                  : "text-emerald-600/60 hover:text-emerald-700"
                }`}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-emerald-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/30">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/50">Client Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/50">Program Type</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/50">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/50">Timeline</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800/50 text-right">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/50">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-emerald-50/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 font-bold shadow-inner">
                          {sub.user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{sub.user.name}</div>
                          <div className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {sub.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-700">{sub.plan.title}</div>
                      <div className="text-[10px] font-bold text-teal-600/60 uppercase">{sub.plan.durationInDays} Day Protocol</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        sub.status === "ACTIVE" 
                        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200" 
                        : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                         <Calendar size={14} className="text-emerald-500" />
                         <span>{new Date(sub.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                         <span className="text-gray-300">→</span>
                         <span className={sub.status === "ACTIVE" ? "text-emerald-600" : "text-gray-400"}>
                            {new Date(sub.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="font-black text-gray-900">₹{sub.plan.price.toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubscriptions.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-4">
                 <Users className="text-emerald-200" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No matches found</h3>
              <p className="text-gray-400 text-sm max-w-xs">Try searching for a different name or changing your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}