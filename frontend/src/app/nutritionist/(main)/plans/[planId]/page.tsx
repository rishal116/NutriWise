"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Clock,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Tag,
  Edit3,
  Info,
  History,
  Sparkles,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";
import { nutritionistPlanService } from "@/services/nutritionist/nutriPlan.service";
import { toast } from "sonner";
import { PlanDto } from "@/dtos/nutritionist/plan/plan.dto";

export default function ViewPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params?.planId as string;

  const [plan, setPlan] = useState<PlanDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) return;
    const fetchPlan = async () => {
      try {
        const res = await nutritionistPlanService.getPlanById(planId);
        setPlan(res);
      } catch (err) {
        console.error("Failed to fetch plan", err);
        toast.error("Failed to load plan details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  if (loading) return <LoadingState />;
  if (!plan) return <NotFoundState />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-slate-500 hover:text-emerald-700 transition-colors font-bold text-sm"
        >
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
            <ArrowLeft size={18} strokeWidth={2.5} />
          </div>
          <span>Back to Portfolio</span>
        </button>

        <button
          onClick={() => router.push(`/nutritionist/plans/edit/${plan.id}`)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-colors"
        >
          <Edit3 size={16} /> Edit Program
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-12 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className={`px-4 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase border ${
                  plan.status === "published"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-amber-50 text-amber-600 border-amber-100"
                }`}
              >
                {plan.status}
              </span>
              <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
                <Tag size={12} className="text-emerald-500" />{" "}
                {plan.specialization.replace(/_/g, " ")}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              {plan.title}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              {plan.description ||
                "No detailed description provided for this plan."}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-12 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <ShieldCheck className="text-emerald-500" size={24} />
                  Program Deliverables
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-9">
                  Client Value Props
                </p>
              </div>
              <Sparkles
                className="text-emerald-200 hidden sm:block"
                size={28}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-100 transition-colors"
                >
                  <div className="shrink-0 w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-sm text-emerald-500">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 leading-tight">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-8 text-white">
            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              Marketplace Pricing
            </p>
            <div className="flex items-baseline gap-2 mb-8">
              {plan.currency === "INR" ? (
                <IndianRupee size={28} className="text-emerald-500" />
              ) : (
                <span className="text-2xl font-bold text-emerald-500">$</span>
              )}
              <span className="text-5xl font-bold tracking-tight">
                {plan.price.toLocaleString()}
              </span>
              <span className="text-slate-500 text-xs font-bold">/ plan</span>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-3 text-sm text-slate-300 font-semibold">
                  <Clock size={16} className="text-emerald-400" /> Duration
                </div>
                <span className="font-bold text-emerald-50">
                  {plan.durationDays} Days
                </span>
              </div>

              <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest">
                  <Calendar size={14} /> Listed Date
                </div>
                <span className="font-semibold text-sm">
                  {new Date(plan.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <History size={14} className="text-emerald-500" /> Audit Trail
            </h3>
            <div className="space-y-5 relative before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                <p className="text-xs font-bold text-slate-800">
                  Last Modified
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {new Date(plan.updatedAt).toLocaleTimeString()} •{" "}
                  {new Date(plan.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-slate-200" />
                <p className="text-xs font-bold text-slate-400">
                  Created Listing
                </p>
                <p className="text-[10px] text-slate-300 font-semibold">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-emerald-900 rounded-2xl text-white flex flex-col gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Info className="text-emerald-400" size={20} />
            </div>
            <p className="text-sm font-medium leading-relaxed text-emerald-50/80">
              Need to boost sales? Try refining your{" "}
              <strong>description</strong> or adding more specific{" "}
              <strong>deliverables</strong> to increase conversion in the client
              marketplace.
            </p>
            <button
              onClick={() => router.push(`/nutritionist/plans/edit/${plan.id}`)}
              className="text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-white transition-colors text-left mt-1"
            >
              Optimize Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse mt-10 px-4">
      <div className="h-8 w-32 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-slate-100 rounded-2xl" />
          <div className="h-64 bg-slate-100 rounded-2xl" />
        </div>
        <div className="h-80 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="p-4 bg-red-50 rounded-full mb-4">
        <Info size={36} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Plan not found</h2>
      <p className="text-slate-500">
        It seems the plan you&apos;re looking for doesn&apos;t exist.
      </p>
    </div>
  );
}
