"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Clock, IndianRupee, FileText, ArrowLeft, 
  CheckCircle2, Calendar, Tag, Edit3, 
  Layout, Info, History, Sparkles, ShieldCheck
} from "lucide-react";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";
import { toast } from "react-hot-toast";

interface Plan {
  id: string;
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  status: "draft" | "published" | "archived";
  features: string[];
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ViewPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params?.planId as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) return;
    const fetchPlan = async () => {
      try {
        const res = await nutritionistPlanService.getPlanById(planId);
        const p = res.data.data;
        setPlan({
          id: p._id,
          title: p.title,
          category: p.category,
          durationInDays: p.durationInDays,
          price: p.price,
          status: p.status,
          features: p.features || [],
          description: p.description,
          tags: p.tags || [],
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        });
      } catch (err: any) {
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
      
      {/* --- TOP NAVIGATION BAR --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-slate-500 hover:text-emerald-700 transition-all font-bold text-sm"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
            <ArrowLeft size={18} strokeWidth={2.5} />
          </div>
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center gap-3">
            <button
            onClick={() => router.push(`/nutritionist/plans/edit/${plan.id}`)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
            >
            <Edit3 size={16} /> Edit Program
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: PRIMARY CONTENT (8 Cols) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Hero Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className={`px-4 py-1 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase border ${
                  plan.status === "published"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-amber-50 text-amber-600 border-amber-100"
                }`}>
                  {plan.status}
                </span>
                <div className="flex items-center gap-2 px-4 py-1 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
                  <Tag size={12} className="text-emerald-500" /> {plan.category}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                {plan.title}
              </h1>

              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                  {plan.description || "No detailed description provided for this professional plan."}
                </p>
              </div>

              {plan.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                  {plan.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 text-[11px] font-bold bg-slate-50 text-slate-500 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-default border border-transparent hover:border-emerald-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Features / Deliverables Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm">
            <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500" size={28} />
                    Program Deliverables
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-10">Client Value Props</p>
                </div>
                <Sparkles className="text-emerald-200 hidden sm:block" size={32} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:bg-emerald-50/50 hover:border-emerald-100 transition-all duration-300">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-900 transition-colors leading-tight">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT: SIDEBAR (4 Cols) --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Investment Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-100 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 blur-[60px] rounded-full" />
            
            <div className="relative z-10">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Marketplace Pricing</p>
                <div className="flex items-baseline gap-2 mb-8">
                <span className="text-2xl font-bold text-emerald-500">₹</span>
                <span className="text-6xl font-black tracking-tighter">{plan.price.toLocaleString()}</span>
                <span className="text-slate-500 text-xs font-bold">/ plan</span>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/10">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 text-sm text-slate-300 font-bold">
                    <Clock size={18} className="text-emerald-400" /> Duration
                    </div>
                    <span className="font-black text-emerald-50 text-lg">{plan.durationInDays} Days</span>
                </div>
                
                <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest">
                    <Calendar size={16} /> Listed Date
                    </div>
                    <span className="font-bold text-sm">{new Date(plan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <History size={16} className="text-emerald-500" /> Audit Trail
            </h3>
            <div className="space-y-6 relative before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shadow-sm" />
                <p className="text-xs font-black text-slate-800">Last Modified</p>
                <p className="text-[10px] text-slate-400 font-bold">{new Date(plan.updatedAt).toLocaleTimeString()} • {new Date(plan.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-slate-200" />
                <p className="text-xs font-black text-slate-400">Created Listing</p>
                <p className="text-[10px] text-slate-300 font-bold">{new Date(plan.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Marketing Tip */}
          <div className="p-8 bg-gradient-to-br from-emerald-900 to-teal-950 rounded-[2.5rem] text-white flex flex-col gap-4 shadow-xl">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Info className="text-emerald-400" size={24} />
             </div>
             <p className="text-sm font-medium leading-relaxed text-emerald-50/80">
               Need to boost sales? Try adding more specific <strong>Tags</strong> or a clearer <strong>Thumbnail</strong> image to increase your click-through rate in the client marketplace.
             </p>
             <button onClick={() => router.push(`/nutritionist/plans/edit/${plan.id}`)} className="text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors text-left mt-2">
                Optimize Now →
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ============================ UI STATES ============================ */

function LoadingState() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse mt-10">
      <div className="h-8 w-32 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-slate-100 rounded-[32px]" />
          <div className="h-64 bg-slate-100 rounded-[32px]" />
        </div>
        <div className="h-80 bg-slate-100 rounded-[32px]" />
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-4 bg-red-50 rounded-full mb-4">
        <Info size={40} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Plan not found</h2>
      <p className="text-slate-500 mb-6">It seems the plan you're looking for doesn't exist.</p>
    </div>
  );
}