"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Bell, User, Settings, Home } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionistAuth.service";
import NutriWiseLogo from "@/components/common/Logo";

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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
      
      {/* ---------------- LEFT SECTION ---------------- */}
      <div className="flex items-center gap-6">
        
        {/* Logo */}
        <NutriWiseLogo 
  onClick={() => router.push("/home")} 
  size="small" 
/>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">
            {name && `Welcome back, Dr. ${name}`}
          </p>
        </div>
      </div>

      {/* ---------------- RIGHT SECTION ---------------- */}
      <div className="flex items-center gap-2">

        {/* Home Button */}
        <button
          onClick={() => router.push("/home")}
          title="Home"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Home
            className={`h-5 w-5 ${
              pathname === "/nutritionist/dashboard"
                ? "text-emerald-600"
                : "text-gray-600"
            }`}
          />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {unreadCount} unread
                  </p>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        notif.unread ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <p className={`text-sm ${
                        notif.unread ? "font-medium text-gray-900" : "text-gray-700"
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
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Image
              src={profileImage || "/images/images.jpg"}
              width={32}
              height={32}
              className="rounded-lg object-cover"
              alt="Profile"
              unoptimized
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{name ? `Dr. ${name}` : "Nutritionist"}</p>
              <p className="text-xs text-gray-500">Nutritionist</p>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p className="font-medium text-sm text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">{email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => router.push("/nutritionist/profile")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  My Profile
                </button>

                <button 
                  onClick={() => router.push("/nutritionist/settings")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}