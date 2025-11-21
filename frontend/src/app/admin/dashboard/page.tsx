"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Stethoscope, Trophy, FileText, CreditCard,
  Settings, MessageSquare, Activity, Bell, ChevronRight, User, LogOut, ChevronUp,
  Search, X, Menu, DollarSign, PlusCircle, TrendingUp, TrendingDown
} from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';



export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropup, setShowDropup] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropupRef = useRef<HTMLDivElement>(null);

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
