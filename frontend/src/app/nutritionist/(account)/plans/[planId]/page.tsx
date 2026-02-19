"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Clock, IndianRupee, FileText, ArrowLeft, 
  CheckCircle2, Calendar, Tag, Edit3, 
  Layout, Info, History
} from "lucide-react";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";
import { toast } from "react-hot-toast";

interface Plan {
  id: string;
  title: string;
  category: string;
  durationInDays: 30 | 90 | 180;
  price: number;
  status: "draft" | "published";
  features: string[];
  description: string;
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
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-semibold text-sm"
        >
          <div className="p-2 rounded-xl bg-white border border-slate-100 group-hover:bg-emerald-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Back to Plans
        </button>

        <button
          onClick={() => router.push(`/nutritionist/plans/edit/${plan.id}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <Edit3 size={18} /> Edit Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                plan.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {plan.status}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-sm font-bold text-slate-400 flex items-center gap-1">
                <Tag size={14} /> {plan.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
              {plan.title}
            </h1>
            
            <p className="text-slate-600 leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1">
              {plan.description || "No description provided."}
            </p>
          </div>

          {/* Features Grid */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" />
              What's included in this plan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:bg-white hover:border-emerald-200 hover:shadow-md group">
                  <div className="mt-0.5 p-1 bg-white rounded-lg text-emerald-500 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info Area */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Price Card */}
          <div className="bg-emerald-900 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Layout size={80} />
            </div>
            
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">Total Pricing</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-bold text-emerald-400">₹</span>
              <span className="text-5xl font-black">{plan.price.toLocaleString()}</span>
            </div>

            <div className="space-y-4 pt-6 border-t border-emerald-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-emerald-200">
                  <Clock size={16} /> Duration
                </div>
                <span className="font-bold">{plan.durationInDays} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-emerald-200">
                  <Calendar size={16} /> Created
                </div>
                <span className="font-bold">{new Date(plan.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Plan History/Metadata */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <History size={16} /> Activity
            </h3>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Last updated {new Date(plan.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="p-6 bg-amber-50 rounded-[32px] border border-amber-100 flex gap-4">
             <Info className="text-amber-500 shrink-0" size={20} />
             <p className="text-xs text-amber-800 leading-relaxed font-medium">
               This plan is visible to clients in the marketplace. To hide it, switch the status to <strong>Draft</strong> in the editor.
             </p>
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