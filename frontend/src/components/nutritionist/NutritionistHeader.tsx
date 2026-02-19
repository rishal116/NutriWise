"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {  Settings, Home,LayoutDashboard, Bell, User,LogOut, CheckCircle2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionistAuth.service";

interface Notification {
  id: string;
  text: string;
  time: string;
  unread: boolean;
}


export default function NutritionistHeader() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const profileRes = await nutritionistAuthService.getName();
        setName(profileRes.data?.name || profileRes.name);
        setEmail(profileRes.data?.email || profileRes.email);
        setProfileImage(profileRes.data?.profileImage || "");

        const notifRes = await nutritionistAuthService.getNotifications();
        setNotifications(notifRes.data || notifRes || []);
      } catch (err) {
        console.error("Header data error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeaderData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-md border-b border-emerald-50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          
          {/* --- LEFT: Logo & Brand --- */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => router.push("/home")}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-base sm:text-lg">🍃</span>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NutriWise
            </span>
          </div>

          {/* --- RIGHT: Tools & Profile --- */}
          <div className="flex items-center gap-1 sm:gap-4">

            {/* Home Icon */}
            <button
              onClick={() => router.push("/nutritionist/dashboard")}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 ${
                pathname === "/home" ? "bg-emerald-50 text-emerald-600 shadow-inner" : "text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
              }`}
            >
              <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Notification Center */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`relative p-2 sm:p-2.5 rounded-xl transition-all duration-200 ${
                  notifOpen ? "bg-emerald-50 text-emerald-600" : "text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-[-40px] sm:right-0 mt-3 w-[calc(100vw-32px)] sm:w-96 bg-white shadow-2xl shadow-emerald-900/10 border border-emerald-50 rounded-[2rem] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-6 py-5 bg-emerald-50/40 border-b border-emerald-50 flex justify-between items-center">
                    <h3 className="font-bold text-emerald-900">Notifications</h3>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">{unreadCount} New</span>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center">
                        <CheckCircle2 className="mx-auto text-emerald-100 mb-3" size={40} />
                        <p className="text-sm font-medium text-gray-400">All caught up!</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="group p-5 border-b border-gray-50 hover:bg-emerald-50/30 transition-colors flex gap-4 cursor-pointer">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                           <div>
                            <p className="text-sm text-gray-700 font-medium group-hover:text-emerald-900">{notif.text}</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">{notif.time}</p>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 p-1 sm:pl-2 sm:pr-2 rounded-2xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-black text-gray-900 truncate w-24 uppercase tracking-tighter">
                    {name ? `Dr. ${name}` : "Nutritionist"}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Expert</p>
                </div>
                <div className="relative w-9 h-9 sm:w-11 sm:h-11">
                  <Image
                    src={profileImage || "/images/images.jpg"}
                    fill
                    className="rounded-xl object-cover border-2 border-white shadow-md shadow-emerald-100/50"
                    alt="Profile"
                    unoptimized
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl shadow-emerald-900/20 border border-emerald-50 rounded-[1.5rem] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-5 border-b border-emerald-50 bg-emerald-50/20">
                    <p className="font-black text-sm text-gray-900 uppercase tracking-tighter leading-none">{name}</p>
                    <p className="text-[11px] text-emerald-600 font-bold mt-1 truncate">{email}</p>
                  </div>
                  <div className="p-2">
                    <button 
                       onClick={() => { router.push("/nutritionist/profile"); setMenuOpen(false); }}
                       className="w-full text-left px-4 py-3 hover:bg-emerald-50 rounded-xl flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4 text-emerald-600" /> My Profile
                    </button>
                    <button 
                       onClick={() => { router.push("/nutritionist/settings"); setMenuOpen(false); }}
                       className="w-full text-left px-4 py-3 hover:bg-emerald-50 rounded-xl flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-emerald-600" /> Settings
                    </button>
                    <div className="my-1 border-t border-emerald-50" />
                    <button 
                       className="w-full text-left px-4 py-3 hover:bg-rose-50 rounded-xl flex items-center gap-3 text-sm font-bold text-rose-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}