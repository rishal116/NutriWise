"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Stethoscope, Trophy, FileText, CreditCard,
  Settings, MessageSquare, Activity, Bell, ChevronRight, User, LogOut, ChevronUp,
  Search, X, Menu, DollarSign, PlusCircle, TrendingUp, TrendingDown
} from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Sidebar data
const navSections = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" }]
  },
  {
    title: "Management",
    items: [
      { name: "Users", icon: Users, path: "/admin/users", badge: "" },
      { name: "Nutritionists", icon: Stethoscope, path: "/admin/nutritionists", badge: "42" },
      { name: "Challenges", icon: Trophy, path: "/admin/challenges" },
      { name: "Posts", icon: FileText, path: "/admin/posts" },
    ]
  },
  {
    title: "Finance & Community",
    items: [
      { name: "Payments", icon: CreditCard, path: "/admin/payments" },
      { name: "Community", icon: MessageSquare, path: "/admin/community" },
    ]
  }
];

// Page titles for navbar
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': { title: 'Dashboard', subtitle: 'Overview of your admin panel' },
  '/admin/users': { title: 'Users', subtitle: 'Manage user accounts and permissions' },
  '/admin/nutritionists': { title: 'Nutritionists', subtitle: 'Manage nutritionist profiles' },
  '/admin/challenges': { title: 'Challenges', subtitle: 'Create and manage challenges' },
  '/admin/posts': { title: 'Posts', subtitle: 'Moderate community posts' },
  '/admin/payments': { title: 'Payments', subtitle: 'Track transactions and revenue' },
  '/admin/settings': { title: 'Settings', subtitle: 'Configure system preferences' },
  '/admin/community': { title: 'Community', subtitle: 'Monitor community activity' },
  '/admin/notifications': { title: 'Notifications', subtitle: 'View all notifications' },
  '/admin/profile': { title: 'Profile', subtitle: 'Manage your admin profile' },
};

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropup, setShowDropup] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropupRef = useRef<HTMLDivElement>(null);

  const currentPage = pageTitles[pathname] || { title: 'Admin Panel', subtitle: 'NutriWise Administration' };

  // Close dropup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropupRef.current && !dropupRef.current.contains(event.target as Node)) {
        setShowDropup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    router.push('/login');
  };

  // Dashboard stats & charts data
  const stats = [
    { label: "Total Users", value: "12,345", icon: Users, color: "text-blue-500", bgColor: "bg-blue-50", trend: "+12.5%", trendUp: true },
    { label: "Nutritionists", value: "567", icon: Stethoscope, color: "text-purple-500", bgColor: "bg-purple-50", trend: "+8.2%", trendUp: true },
    { label: "Revenue", value: "$123,456", icon: DollarSign, color: "text-emerald-500", bgColor: "bg-emerald-50", trend: "+23.1%", trendUp: true },
    { label: "Challenges", value: "321", icon: Trophy, color: "text-orange-500", bgColor: "bg-orange-50", trend: "-3.4%", trendUp: false },
  ];

  const userGrowthData = [
    { name: "Jan", users: 400 }, { name: "Feb", users: 300 }, { name: "Mar", users: 500 },
    { name: "Apr", users: 350 }, { name: "May", users: 420 }, { name: "Jun", users: 600 },
  ];

  const revenueData = [
    { name: "Jan", revenue: 3000 }, { name: "Feb", revenue: 2500 }, { name: "Mar", revenue: 4000 },
    { name: "Apr", revenue: 3500 }, { name: "May", revenue: 4200 }, { name: "Jun", revenue: 5000 },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-slate-50 to-white shadow-xl border-r border-slate-200 flex flex-col z-50">
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">NutriWise</h2>
              <p className="text-xs text-slate-500 font-medium">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{section.title}</h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <button
                      key={item.name}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                        ${isActive ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-md"}`}
                    >
                      <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-white" : "text-slate-500"}`} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="relative z-10 flex-1 text-left">{item.name}</span>
                      {item.badge && (
                        <span className={`relative z-10 text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>{item.badge}</span>
                      )}
                      {isActive && <ChevronRight className="w-4 h-4 relative z-10" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Notifications */}
        <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <button
            onClick={() => router.push("/admin/notifications")}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 relative rounded-xl transition-all duration-200 shadow-sm border border-slate-200 group"
          >
            <div className="relative">
              <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" strokeWidth={2} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <span className="text-sm font-medium flex-1 text-left">Notifications</span>
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">5</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 bg-white relative" ref={dropupRef}>
          {showDropup && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-2 duration-200 opacity-100">
              <div className="py-2">
                <button onClick={() => { router.push('/admin/profile'); setShowDropup(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                  <User className="w-4 h-4" /><span className="text-sm font-medium">View Profile</span>
                </button>
                <button onClick={() => { router.push('/admin/settings'); setShowDropup(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                  <Settings className="w-4 h-4" /><span className="text-sm font-medium">Settings</span>
                </button>
                <div className="my-1 border-t border-slate-200"></div>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" /><span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}

          <button onClick={() => setShowDropup(!showDropup)} className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">AD</div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-slate-800 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@nutriwise.com</p>
            </div>
            <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDropup ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-72 pt-24 bg-gray-50 min-h-screen p-8 w-full">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* --- Place your full dashboard content here --- */}
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white shadow-sm rounded-xl p-6 border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <div className={`p-3 rounded-lg ${stat.bgColor} transition-transform hover:scale-110`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <div className="flex items-center gap-1">
                  {stat.trendUp ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                  <span className={`text-sm font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>{stat.trend}</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">User Growth</h4>
                  <p className="text-sm text-gray-500 mt-1">Monthly active users</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">+42.5%</p>
                  <p className="text-xs text-gray-500">Growth rate</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">Revenue Trend</h4>
                  <p className="text-sm text-gray-500 mt-1">Monthly revenue in USD</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">$5,000</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h4 className="font-semibold text-gray-800 text-lg mb-5">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-3 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
                <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">Add Challenge</span>
              </button>
<button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-6 py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
  <Stethoscope/>
  <span className="font-medium">Approve Nutritionist</span>
</button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <DollarSign size={20} />
                <span className="font-medium">Review Refunds</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h4 className="font-semibold text-gray-800 text-lg mb-4">Recent Activity</h4>
            <div className="space-y-4">
              {[
                { user: "John Doe", action: "joined the platform", time: "2 minutes ago", color: "bg-blue-100 text-blue-600" },
                { user: "Sarah Smith", action: "completed a challenge", time: "15 minutes ago", color: "bg-emerald-100 text-emerald-600" },
                { user: "Mike Johnson", action: "requested a refund", time: "1 hour ago", color: "bg-orange-100 text-orange-600" },
                { user: "Emily Davis", action: "posted in community", time: "2 hours ago", color: "bg-purple-100 text-purple-600" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color} font-semibold text-sm`}>
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
