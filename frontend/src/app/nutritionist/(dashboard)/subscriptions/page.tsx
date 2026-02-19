"use client";

import { useEffect, useState } from "react";
import { nutritionistSubscriptionService } from "@/services/nutritionist/nutritionistSubscription.service";
import { User, CreditCard, Calendar, Activity, Mail } from "lucide-react";

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
  const [subscriptions, setSubscriptions] = useState<NutritionistSubscription[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Quick stats calculations
  const activeClients = subscriptions.filter(s => s.status === "ACTIVE").length;
  const totalRevenue = subscriptions.reduce((acc, s) => acc + s.plan.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-emerald-800 font-medium">Loading your client roster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[#fbfdfd] min-h-screen">
      {/* --- HEADER & STATS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            My <span className="text-emerald-600">Clients</span>
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your active subscribers and program history.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-40 bg-white p-4 rounded-2xl shadow-sm border border-emerald-50">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-black text-gray-900">{activeClients}</p>
          </div>
          <div className="flex-1 md:w-40 bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-100 text-white">
            <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Revenue</p>
            <p className="text-2xl font-black">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      {subscriptions.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-20 text-center border border-emerald-50 shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="text-emerald-500 w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No active subscriptions</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Once users purchase your nutrition plans, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm border border-emerald-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-emerald-50/50">
                  <th className="px-6 py-5 text-left text-xs font-bold text-emerald-800 uppercase tracking-widest">Client Identity</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-emerald-800 uppercase tracking-widest">Subscription</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-emerald-800 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-emerald-800 uppercase tracking-widest">Timeline</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-emerald-50/30">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-emerald-50/20 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-700 font-bold">
                          {sub.user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{sub.user.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={12} className="text-emerald-400" /> {sub.user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="font-bold text-gray-800">{sub.plan.title}</div>
                      <div className="text-xs text-gray-500 font-medium">
                        ₹{sub.plan.price.toLocaleString()} • {sub.plan.durationInDays} days
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          sub.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                        }`}
                      >
                        <Activity size={10} />
                        {sub.status}
                      </span>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs font-bold text-gray-700 flex items-center gap-2">
                          <Calendar size={14} className="text-emerald-500" />
                          <span>{new Date(sub.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 pl-5 uppercase">
                          Until {new Date(sub.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}