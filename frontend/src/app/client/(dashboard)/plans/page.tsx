"use client";

import { useEffect, useState } from "react";
import { userPlanService } from "@/services/user/userPlan.service";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Calendar,
  FileText,
  Loader2,
  ArrowRight,
  ShoppingBag,
  Zap,
} from "lucide-react";

/* ── TYPES ── */
interface Plan {
  id: string;
  title: string;
  price: number;
  durationInDays: number;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  startDate: string;
  endDate: string;
  program?: {
    goal: string;
    status: string;
    currentDay: number;
    completion: number;
    daysRemaining: number;
  };
}

/* ── STATUS CONFIGS ── */
const statusBadge: Record<string, string> = {
  ACTIVE:    "bg-emerald-100 text-emerald-700 border-emerald-200",
  EXPIRED:   "bg-gray-100   text-gray-500   border-gray-200",
  CANCELLED: "bg-red-100    text-red-600    border-red-200",
  PENDING:   "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const paymentBadge: Record<string, string> = {
  paid:     "bg-emerald-50 text-emerald-600 border-emerald-100",
  pending:  "bg-yellow-50  text-yellow-600  border-yellow-100",
  failed:   "bg-red-50     text-red-600     border-red-100",
  refunded: "bg-blue-50    text-blue-600    border-blue-100",
};

/* ── PLAN CARD ── */
function PlanCard({ p, accentBar }: { p: Plan; accentBar: string }) {
  const router = useRouter();

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      <div className={`h-1 w-full ${accentBar}`} />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* ── TOP ROW ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-base text-gray-900 truncate leading-snug mb-1">
              {p.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-2">
              <span>₹{p.price.toLocaleString()}</span>
              <span className="text-gray-200">•</span>
              <span>{p.durationInDays} days</span>
            </div>
            {p.program?.goal && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <User size={12} className="flex-shrink-0 text-emerald-500" />
                <span className="capitalize truncate">
                  {p.program.goal.replace(/_/g, " ")}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span
              className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-full border ${
                statusBadge[p.status] ?? "bg-gray-100 text-gray-500 border-gray-200"
              }`}
            >
              {p.status}
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                paymentBadge[p.paymentStatus] ?? "bg-gray-50 text-gray-500 border-gray-100"
              }`}
            >
              {p.paymentStatus}
            </span>
          </div>
        </div>

        {/* ── PROGRESS ── */}
        {p.program && (
          <div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium mb-1.5">
              <span>Progress</span>
              <span className="font-black text-gray-600">
                {Math.round(p.program.completion)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(p.program.completion, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-1">
              Day {p.program.currentDay}&nbsp;·&nbsp;{p.program.daysRemaining} days left
            </p>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
          <div>
            <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mb-0.5">
              <Calendar size={11} className="flex-shrink-0" />
              Valid Until
            </p>
            <p className="text-sm font-bold text-gray-800">
              {new Date(p.endDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <button
            onClick={() => router.push(`/client/plans/${p.id}`)}
            className={`inline-flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-xl transition-all duration-200 ${
              p.status === "ACTIVE"
                ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:gap-2.5 shadow-sm hover:shadow-emerald-100 hover:shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:gap-2.5"
            }`}
          >
            <Zap size={12} className="flex-shrink-0" />
            Go to Program
            <ArrowRight size={12} className="flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE ── */
export default function UserPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await userPlanService.getMyPlans();
        // ✅ FIXED: was res.data — correct shape is res.data.data
        setPlans(res.data ?? []);
      } catch {
        setError("Failed to load your plans. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  /* ── LOADING — no full-screen bg, fits inside dashboard layout ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <Loader2 className="w-9 h-9 text-emerald-500 animate-spin mx-auto" />
          <p className="text-emerald-700 font-semibold text-sm tracking-wide">
            Loading your plans…
          </p>
        </div>
      </div>
    );
  }

  /* ── ERROR ── */
  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <p className="text-red-500 font-semibold text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-emerald-600 hover:underline font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ── FILTER ── */
  const activePlans    = plans.filter((p) => p.status === "ACTIVE");
  const expiredPlans   = plans.filter((p) => p.status === "EXPIRED");
  const cancelledPlans = plans.filter((p) => p.status === "CANCELLED");

  const sections = [
    {
      items:   activePlans,
      title:   "Active Plans",
      icon:    <CheckCircle2 size={17} />,
      color:   "text-emerald-600",
      accent:  "bg-gradient-to-r from-emerald-500 to-teal-500",
      count:   activePlans.length,
      countBg: "bg-emerald-100 text-emerald-700",
    },
    {
      items:   expiredPlans,
      title:   "Expired Plans",
      icon:    <Clock size={17} />,
      color:   "text-gray-500",
      accent:  "bg-gradient-to-r from-gray-300 to-gray-400",
      count:   expiredPlans.length,
      countBg: "bg-gray-100 text-gray-500",
    },
    {
      items:   cancelledPlans,
      title:   "Cancelled Plans",
      icon:    <XCircle size={17} />,
      color:   "text-red-500",
      accent:  "bg-gradient-to-r from-red-400 to-rose-400",
      count:   cancelledPlans.length,
      countBg: "bg-red-100 text-red-600",
    },
  ];

  return (
    /* No min-h-screen or bg — inherited from DashboardLayout */
    <div className="font-sans pb-12 space-y-8">

      {/* ── PAGE HEADER ── */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl px-7 py-9 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-14 -mt-14 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-8 -mb-8 blur-2xl pointer-events-none" />

        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1">
            My Plans
          </h1>
          <p className="text-white/70 text-sm font-medium">
            Track and manage your nutrition journey
          </p>

          {plans.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {sections.filter((s) => s.count > 0).map((s) => (
                <div
                  key={s.title}
                  className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold"
                >
                  {s.icon}
                  <span>{s.count} {s.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── EMPTY STATE ── */}
      {plans.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full mb-4">
            <FileText className="text-emerald-400" size={24} />
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">
            No Plans Yet
          </h3>
          <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto leading-relaxed">
            You haven't subscribed to any nutrition plan yet. Find a coach and get started!
          </p>
          <button
            onClick={() => router.push("/coaching")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <ShoppingBag size={14} className="flex-shrink-0" />
            Browse Plans
          </button>
        </div>
      )}

      {/* ── PLAN SECTIONS ── */}
      {sections.map(
        (s) =>
          s.items.length > 0 && (
            <section key={s.title} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={s.color}>{s.icon}</span>
                <h2 className={`text-base font-extrabold ${s.color}`}>
                  {s.title}
                </h2>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${s.countBg}`}>
                  {s.count}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {s.items.map((p) => (
                  <PlanCard key={p.id} p={p} accentBar={s.accent} />
                ))}
              </div>
            </section>
          )
      )}
    </div>
  );
}