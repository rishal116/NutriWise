"use client";

import { useEffect, useState } from "react";
import { nutritionistSubscriptionService } from "@/services/nutritionist/nutritionistSubscription.service";
import { Users, Calendar, DollarSign, Clock, Mail, User, TrendingUp, Filter, Search } from "lucide-react";
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
  useNutritionistGuard()
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
      console.log("API RESPONSE:", res);
      setSubscriptions(res.data);
    } catch (error) {
      console.error("Failed to fetch nutritionist subscriptions", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesFilter = filter === "ALL" || sub.status === filter;
    const matchesSearch = 
      sub.user.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.user.email.toLowerCase().includes(search.toLowerCase()) ||
      sub.plan.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === "ACTIVE").length,
    expired: subscriptions.filter(s => s.status === "EXPIRED").length,
    revenue: subscriptions.reduce((sum, s) => sum + s.plan.price, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent mb-4"></div>
          <p className="text-emerald-700 font-semibold text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            My Clients
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and track your client subscriptions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Clients</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Active Clients</p>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                <Clock className="text-white" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Expired</p>
            <p className="text-3xl font-bold text-gray-900">{stats.expired}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by client name, email, or plan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filter === "ALL"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("ACTIVE")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filter === "ACTIVE"
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("EXPIRED")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filter === "EXPIRED"
                    ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Expired
              </button>
            </div>
          </div>
        </div>

        {/* Table or Empty State */}
        {filteredSubscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-gray-300 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {search || filter !== "ALL" ? "No clients found" : "No clients yet"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {search || filter !== "ALL"
                ? "Try adjusting your search or filters"
                : "No users have purchased your plans yet. Start promoting your services!"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                Client Subscriptions ({filteredSubscriptions.length})
              </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Plan Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                            <User className="text-emerald-600" size={18} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{sub.user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail size={12} />
                              {sub.user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div>
                          <div className="font-semibold text-gray-900">{sub.plan.title}</div>
                          <div className="text-sm text-gray-500">
                            {sub.plan.durationInDays} days program
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                            sub.status === "ACTIVE"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar size={14} className="text-emerald-600" />
                            <span className="font-medium">Start:</span> {new Date(sub.startDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar size={14} className="text-red-600" />
                            <span className="font-medium">End:</span> {new Date(sub.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="font-bold text-lg text-emerald-600">
                          ₹{sub.plan.price.toLocaleString()}
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
    </div>
  );
}