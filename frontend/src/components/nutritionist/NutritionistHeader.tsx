"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Bell, User, Settings, Home } from "lucide-react";
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
    <header className="h-20 bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-b border-emerald-100 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-sm bg-opacity-80">
      
      {/* ---------------- LEFT SECTION ---------------- */}
      <div className="flex items-center gap-4">
        
        {/* Home Button */}
        <button
          onClick={() => router.push("/home")}
          title="Home"
          className="p-3 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:shadow-md group"
        >
          <Home
            className={`h-5 w-5 transition-colors ${
              pathname === "/nutritionist/dashboard"
                ? "text-emerald-600"
                : "text-gray-600 group-hover:text-emerald-600"
            }`}
          />
        </button>

        {/* Dashboard Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-xs text-gray-500 -mt-0.5">
              Welcome back {name && `, Dr.${name}`}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT SECTION ---------------- */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-3 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:shadow-md group"
          >
            <Bell className="h-5 w-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse ring-2 ring-white"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <p className="text-xs text-emerald-50 mt-0.5">
                  You have {unreadCount} unread messages
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No notifications</p>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-100 hover:bg-emerald-50/50 ${
                        notif.unread ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <p className={`text-sm ${
                        notif.unread ? "font-medium text-gray-900" : "text-gray-600"
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
            className="flex items-center gap-3 p-2 pr-4 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:shadow-md group"
          >
            <Image
              src={profileImage || "/images/images.jpg"}
              width={40}
              height={40}
              className="rounded-xl object-cover ring-2 ring-emerald-200"
              alt="Profile"
              unoptimized
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800">{`Dr.${name}`}</p>
              <p className="text-xs text-gray-500">Nutritionist</p>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-emerald-50">{email}</p>
              </div>

              <div className="py-2">
                <button
                  onClick={() => router.push("/nutritionist/profile")}
                  className="w-full text-left px-4 py-3 hover:bg-emerald-50 flex items-center gap-3"
                >
                  <User className="h-4 w-4 text-emerald-600" />
                  My Profile
                </button>

                <button className="w-full text-left px-4 py-3 hover:bg-emerald-50 flex items-center gap-3">
                  <Settings className="h-4 w-4 text-teal-600" />
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
