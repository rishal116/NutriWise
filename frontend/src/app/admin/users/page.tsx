"use client";

import { useState, useEffect } from "react";
import UserTable from "@/components/admin/UserTable";
import { adminUserService } from "@/services/admin/adminUser.service";
import Loading from "@/app/admin/loading";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "teal" | "emerald" | "red" | "blue";
}

const COLOR_MAP = {
  teal:    { bg: "bg-teal-50",    icon: "bg-teal-100 text-teal-600",    text: "text-teal-700"    },
  emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", text: "text-emerald-700" },
  red:     { bg: "bg-red-50",     icon: "bg-red-100 text-red-500",       text: "text-red-600"     },
  blue:    { bg: "bg-blue-50",    icon: "bg-blue-100 text-blue-600",     text: "text-blue-700"    },
};

function StatCard({ label, value, icon, color }: StatCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className={`${c.bg} rounded-2xl px-5 py-4 flex items-center gap-4 border border-white shadow-sm`}>
      <div className={`${c.icon} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <p className={`text-xl font-extrabold ${c.text} leading-tight`}>{value}</p>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<PaginatedResponse<UserDTO> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminUserService.getAllUsers(1, 10);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (isLoading) return <Loading />;

  const total   = users?.total ?? 0;
  const active  = users?.data.filter((u) => !u.isBlocked).length ?? 0;
  const blocked = users?.data.filter((u) => u.isBlocked).length ?? 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View and manage NutriWise community members.
          </p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
          </span>
          Live data
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Users"
          value={total}
          icon={<Users size={18} strokeWidth={1.8} />}
          color="teal"
        />
        <StatCard
          label="Active"
          value={active}
          icon={<UserCheck size={18} strokeWidth={1.8} />}
          color="emerald"
        />
        <StatCard
          label="Blocked"
          value={blocked}
          icon={<UserX size={18} strokeWidth={1.8} />}
          color="red"
        />
        <StatCard
          label="This Page"
          value={users?.data.length ?? 0}
          icon={<TrendingUp size={18} strokeWidth={1.8} />}
          color="blue"
        />
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
        {users ? (
          <UserTable initialData={users} />
        ) : (
          <div className="py-20 text-center text-sm text-slate-400 font-medium">
            No user data available.
          </div>
        )}
      </div>
    </div>
  );
}