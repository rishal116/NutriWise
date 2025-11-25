"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

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

        {/* Mobile Menu Toggle */}
        <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors duration-200 group lg:hidden">
          <Menu className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
        </button>
        
      </div>
    </header>
  );
}
