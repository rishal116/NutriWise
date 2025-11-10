"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, X, Menu } from 'lucide-react';

// Map paths to readable titles
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

export default function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPage = pageTitles[pathname] || { 
    title: 'Admin Panel', 
    subtitle: 'NutriWise Administration' 
  };

  return (
<header className="fixed top-0 left-0 ml-72 w-[calc(100%-18rem)] bg-white shadow-md border-b border-slate-200 z-50">
  <div className="flex justify-between items-center px-8 py-4">
    {/* Dynamic Page Title */}
    <div className="flex-1">
      <h1 className="text-2xl font-bold text-slate-800">{currentPage.title}</h1>
      <p className="text-sm text-slate-500 mt-1">{currentPage.subtitle}</p>
    </div>
        
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 animate-in fade-in slide-in-from-right-5 duration-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users, posts, challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-64"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors duration-200 group"
            >
              <Search className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors duration-200 group lg:hidden">
            <Menu className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
          </button>
        </div>
      </div>
    </header>
  );
}
