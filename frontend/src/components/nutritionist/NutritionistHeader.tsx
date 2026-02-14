"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Bell, User, Settings, Home, Menu, X, Loader2 } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  /* ---------------- Fetch Header Data ---------------- */
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const profileRes = await nutritionistAuthService.getName();

        setName(profileRes.data?.name || profileRes.name);
        setEmail(profileRes.data?.email || profileRes.email);
        setProfileImage(profileRes.data?.profileImage || "");

        const notifRes = await nutritionistAuthService.getNotifications();
        setNotifications(notifRes.data || notifRes);
      } catch (err) {
        console.error("Header data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  /* ---------------- Click Outside Handler ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          
          {/* ---------------- LEFT SECTION ---------------- */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Logo */}
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              🍃
            </div>

            {/* Divider - Hidden on mobile */}
            <div className="hidden sm:block h-8 w-px bg-gray-200"></div>

            {/* Page Title */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
              {loading ? (
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
              ) : (
                <p className="text-xs text-gray-500">
                  {name && `Welcome back, Dr. ${name}`}
                </p>
              )}
            </div>
          </div>

          {/* ---------------- RIGHT SECTION ---------------- */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Home Button */}
            <button
              onClick={() => router.push("/home")}
              title="Home"
              className="p-2 sm:p-2.5 rounded-xl hover:bg-emerald-50 transition-colors group"
            >
              <Home
                className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${
                  pathname === "/home"
                    ? "text-emerald-600"
                    : "text-gray-600 group-hover:text-emerald-600"
                }`}
              />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 sm:p-2.5 rounded-xl hover:bg-emerald-50 transition-colors group"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="px-4 sm:px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-gray-600 mt-0.5">
                        {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No notifications</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                            notif.unread ? "bg-emerald-50/30" : ""
                          }`}
                        >
                          <p className={`text-sm ${
                            notif.unread ? "font-semibold text-gray-900" : "text-gray-700"
                          }`}>
                            {notif.text}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 sm:gap-2.5 p-1 sm:p-1.5 pr-2 sm:pr-3 rounded-2xl hover:bg-emerald-50 transition-colors"
              >
                {loading ? (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                ) : (
                  <Image
                    src={profileImage || "/images/images.jpg"}
                    width={40}
                    height={40}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover border-2 border-emerald-100"
                    alt="Profile"
                    unoptimized
                  />
                )}
                <div className="hidden md:block text-left">
                  {loading ? (
                    <div className="space-y-1">
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-2 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-gray-900">{name ? `Dr. ${name}` : "Nutritionist"}</p>
                      <p className="text-xs text-gray-500">Nutritionist</p>
                    </>
                  )}
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="px-4 sm:px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
                    <p className="font-semibold text-sm sm:text-base text-gray-900">{name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{email}</p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        router.push("/nutritionist/profile");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 sm:px-5 py-3 hover:bg-emerald-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                    >
                      <User className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">My Profile</span>
                    </button>

                    <button 
                      onClick={() => {
                        router.push("/nutritionist/settings");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 sm:px-5 py-3 hover:bg-emerald-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                    >
                      <Settings className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">Settings</span>
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