"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  UserCheck,
  CalendarCheck,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionistAuth.service";
import { userAuthService } from "@/services/user/userAuth.service";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Logo from "../layout/Logo";

// ─── Types ─────────────────────────────

type Role = "client" | "nutritionist" | "admin";

interface UserData {
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

// ─── Helper ─────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const NOTIF_ICONS: Record<string, React.ElementType> = {
  client: UserCheck,
  session: CalendarCheck,
  message: MessageCircle,
};

// ───────────────────────────────────────

export default function NutritionistHeader() {
  const [user, setUser] = useState<UserData | null>(null);
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
  const initials = getInitials(name || "User");

  // ───────────────────────────────────────

  return (
    <header className="h-16 bg-white/85 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">

        {/* ── LEFT (logo — untouched) ── */}
        <div
          onClick={() => router.push("/nutritionist/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Logo onClick={() => router.push("/nutritionist/dashboard")} />
          <span className="font-bold text-emerald-600">NutriWise</span>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex items-center gap-3">

          {/* NOTIFICATIONS */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setMenuOpen(false);
              }}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-150"
            >
              <Bell size={18} className="text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* NOTIF DROPDOWN */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/60 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {/* List */}
                <div className="py-1.5 px-2 flex flex-col gap-0.5 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                          n.unread
                            ? "bg-emerald-50 hover:bg-emerald-100/60"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            n.unread ? "bg-emerald-100" : "bg-gray-100"
                          }`}
                        >
                          <Bell
                            size={14}
                            className={n.unread ? "text-emerald-600" : "text-gray-400"}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-medium leading-snug ${
                              n.unread ? "text-emerald-800" : "text-gray-700"
                            }`}
                          >
                            {n.text}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                        </div>
                        {n.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-4 py-2.5">
                  <button className="w-full text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE BUTTON */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-150"
            >
              {profileImage ? (
                <Image
                  src={profileImage}
                  width={34}
                  height={34}
                  alt="profile"
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-[34px] h-[34px] rounded-lg bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-800 flex-shrink-0">
                  {initials}
                </div>
              )}

              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight">{name}</p>
                <p className="text-[10px] text-emerald-600 leading-tight capitalize">
                  {user?.activeRole}
                </p>
              </div>

              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* PROFILE DROPDOWN */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/60 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">

                {/* User card */}
                <div className="p-3.5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        width={42}
                        height={42}
                        alt="profile"
                        className="rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-[42px] h-[42px] rounded-xl bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-800 flex-shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{email}</p>
                    </div>
                    <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 capitalize">
                      {user?.activeRole}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-1.5 border-b border-gray-100">
                  <MenuButton
                    icon={<User size={15} className="text-emerald-600" />}
                    label="My Profile"
                    sublabel="View & edit your info"
                    onClick={() => {
                      router.push("/nutritionist/profile");
                      setMenuOpen(false);
                    }}
                  />
                  <MenuButton
                    icon={<Settings size={15} className="text-emerald-600" />}
                    label="Settings"
                    sublabel="Preferences & security"
                    onClick={() => {
                      router.push("/nutritionist/settings");
                      setMenuOpen(false);
                    }}
                  />
                </div>

                {/* Switch role */}
                {user?.roles && user.roles.length > 1 && (
                  <div className="p-1.5 border-b border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">
                      Switch role
                    </p>
                    {user.roles.map((role) => {
                      const isActive = user.activeRole === role;
                      return (
                        <button
                          key={role}
                          onClick={() => handleSwitchRole(role)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              isActive ? "bg-emerald-500" : "bg-gray-300"
                            }`}
                          />
                          <span className={`flex-1 text-left capitalize font-medium text-xs ${isActive ? "text-emerald-700" : "text-gray-500"}`}>
                            {role}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-semibold text-emerald-600">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Logout */}
                <div className="p-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
                  >
                    <div className="w-[30px] h-[30px] rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors">
                      <LogOut size={14} className="text-red-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold leading-tight">Logout</p>
                      <p className="text-[10px] text-red-300 leading-tight">End your session</p>
                    </div>
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

// ─── Sub-components ─────────────────────

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick?: () => void;
}

function MenuButton({ icon, label, sublabel, onClick }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors group text-left"
    >
      <div className="w-[30px] h-[30px] rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center flex-shrink-0 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-700 leading-tight">{label}</p>
        {sublabel && (
          <p className="text-[10px] text-gray-400 leading-tight">{sublabel}</p>
        )}
      </div>
      <ChevronRight size={13} className="text-gray-300 group-hover:text-emerald-400 transition-colors" />
    </button>
  );
}