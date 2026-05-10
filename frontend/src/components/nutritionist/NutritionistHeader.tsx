"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Bell, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionistAuth.service";
import { userAuthService } from "@/services/user/userAuth.service";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Logo from "../layout/Logo";

// ─── Types ─────────────────────────────

type Role = "client" | "nutritionist" | "admin";

interface User {
  fullName: string;
  email: string;
  roles: Role[];
  activeRole: Role;
  nutritionistStatus?: "pending" | "approved" | "rejected" | "none";
}

interface Notification {
  id: string;
  text: string;
  time: string;
  unread: boolean;
}

// ───────────────────────────────────────

export default function NutritionistHeader() {
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // ─── FETCH USER ───────────────────────
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const res = await userAuthService.getMe();

        if (!res.success || !res.user) return;

        const u = res.user;

        setUser(u);
        setName(u.fullName);
        setEmail(u.email);

        const notifRes = await nutritionistAuthService.getNotifications();
        setNotifications(notifRes.data || notifRes || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHeaderData();
  }, []);

  // ─── LOGOUT ───────────────────────────
  const handleLogout = async () => {
    try {
      await userAuthService.logout();

      dispatch(logout());

      setUser(null);
      setName("");
      setEmail("");
      setProfileImage("");

      setMenuOpen(false);
      setNotifOpen(false);

      router.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ─── SWITCH ROLE ──────────────────────
  const handleSwitchRole = async (role: Role) => {
    if (!user) return;

    try {
      setUser({ ...user, activeRole: role });

      await userAuthService.switchRole(role);

      if (role === "client") router.push("/home");
      if (role === "nutritionist") router.push("/nutritionist/dashboard");
      if (role === "admin") router.push("/admin");
    } catch (err) {
      console.error(err);
    }
  };

  // ─── CLICK OUTSIDE ────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);

      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // ───────────────────────────────────────

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-emerald-50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        {/* LEFT */}
        <div
          onClick={() => router.push("/nutritionist/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Logo onClick={() => router.push("/nutritionist/dashboard")} />
          <span className="font-bold text-emerald-600">NutriWise</span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* NOTIFICATIONS */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-xl hover:bg-emerald-50"
            >
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 border-b text-sm">
                    {n.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2"
            >
              <Image
                src={profileImage || "/images/images.jpg"}
                width={40}
                height={40}
                alt="profile"
                className="rounded-full"
              />

              <div className="hidden sm:block">
                <p className="text-xs font-bold">{name}</p>
                <p className="text-[10px] text-emerald-600">
                  {user?.activeRole}
                </p>
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg overflow-hidden">
                {/* USER */}
                <div className="p-3 border-b">
                  <p className="font-bold">{name}</p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>

                {/* PROFILE */}
                <button
                  onClick={() => {
                    router.push("/nutritionist/profile");
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-emerald-50 text-sm"
                >
                  <User size={16} />
                  My Profile
                </button>

                {/* SWITCH ROLE */}
                {user?.roles && user.roles.length > 1 && (
                  <div className="border-t p-2">
                    <p className="text-[10px] font-bold text-gray-400 px-2">
                      Switch Role
                    </p>

                    {user.roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => handleSwitchRole(role)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          user.activeRole === role
                            ? "bg-emerald-50 text-emerald-700"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}

                {/* LOGOUT */}
                <div className="border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
