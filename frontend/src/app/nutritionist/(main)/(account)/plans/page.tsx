"use client";

import { useEffect, useState } from "react";
import { 
  Clock, Eye, FileText, Plus, 
  IndianRupee, AlertCircle, TrendingUp, 
  ChevronRight, MoreHorizontal, Sparkles, LayoutGrid, Layers 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";

/* ============================== TYPES ============================== */
interface Plan {
  _id: string;
  id?: string; // Support for mapped id
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  status: "draft" | "published" | "archived";
  features: string[];
  description: string;
  tags: string[];
}

export default function MyPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft" | "archived">("all");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await nutritionistPlanService.getPlans();
        const mappedPlans = res.data.data.map((p: Plan) => ({
          ...p,
          id: p._id,
          features: p.features || [],
          tags: p.tags || [],
        }));
        setPlans(mappedPlans);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(p => 
    activeTab === "all" ? true : p.status === activeTab
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* --- HERO HEADER --- */}
      <div className="relative overflow-hidden bg-emerald-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl shadow-emerald-200">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full backdrop-blur-md">
              <Sparkles size={14} className="text-emerald-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Nutrition Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Manage Your <span className="text-emerald-400">Programs.</span>
            </h1>
            <p className="text-emerald-100/70 text-sm md:text-base font-medium max-w-md">
              Create, edit, and track your high-performance nutrition packages from one central hub.
            </p>
          </div>
          
          <button
            onClick={() => router.push("/nutritionist/plans/create")}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-emerald-900 font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus size={20} strokeWidth={3} className="relative z-10" /> 
            <span className="relative z-10">Launch New Plan</span>
          </button>
        </div>
      </div>

      {/* --- FILTER & STATS BAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="inline-flex p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200/50">
          {["all", "published", "draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                activeTab === tab 
                ? "bg-white text-emerald-700 shadow-sm border border-emerald-100" 
                : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
              <Layers size={14} className="text-emerald-500" />
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">
                {filteredPlans.length} Active Listings
              </span>
           </div>
        </div>
      </div>

      {/* --- GRID --- */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} router={router} />
          ))}
        </div>
      ) : (
        <EmptyState hasPlans={plans.length > 0} activeTab={activeTab} />
      )}
    </div>
  );
}

function PlanCard({ plan, router }: { plan: Plan; router: any }) {
  const isPublished = plan.status === "published";

  return (
    <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden h-[420px]">
      {/* Decorative Gradient Background (visible on hover) */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-8 flex-1 flex flex-col">
        {/* Header: Status */}
        <div className="flex justify-between items-start mb-6">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.15em] uppercase border shadow-sm ${
            isPublished 
            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
            : "bg-slate-50 text-slate-400 border-slate-100"
          }`}>
            {plan.status}
          </div>
          <button className="p-2 text-slate-300 hover:text-emerald-600 transition-colors bg-slate-50/50 rounded-xl">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Title Section */}
        <div className="space-y-2 mb-6">
          <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">{plan.category}</span>
          <h3 className="text-2xl font-black text-slate-900 leading-[1.1] group-hover:text-emerald-800 transition-colors">
            {plan.title}
          </h3>
        </div>

        {/* Details Bar */}
        <div className="flex items-center gap-4 mb-6 p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50">
          <div className="flex items-center gap-1.5">
             <Clock size={14} className="text-emerald-500" />
             <span className="text-xs font-bold text-slate-600">{plan.durationInDays} Days</span>
          </div>
          <div className="w-px h-3 bg-slate-200" />
          <div className="flex items-center gap-1.5">
             <LayoutGrid size={14} className="text-emerald-500" />
             <span className="text-xs font-bold text-slate-600">{plan.features.length} Features</span>
          </div>
        </div>

        {/* Features Preview */}
        <div className="space-y-3 flex-1 overflow-hidden">
          {plan.features.slice(0, 2).map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-sm text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{feature}"</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Footer */}
      <div className="relative px-8 py-6 bg-slate-900 flex items-center justify-between border-t border-white/10 overflow-hidden">
        {/* Teal Accent Blur */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/20 blur-2xl" />
        
        <div className="relative z-10">
          <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest block">Investment</span>
          <div className="flex items-center font-black text-white">
            <IndianRupee size={16} strokeWidth={3} className="text-emerald-400" />
            <span className="text-2xl tracking-tighter">{plan.price.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="relative z-10 flex gap-2">
          <button 
            onClick={() => router.push(`/nutritionist/plans/edit/${plan._id}`)}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition-all backdrop-blur-md"
          >
            <FileText size={18} />
          </button>
          <button 
            onClick={() => router.push(`/nutritionist/plans/${plan._id}`)}
            className="flex items-center gap-2 pl-4 pr-3 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-xl transition-all shadow-lg"
          >
            <span className="text-[10px] uppercase">Review</span>
            <ChevronRight size={16} strokeWidth={4} />
          </button>
        </div>
      </div>
    </div>
  );
}


function LoadingSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-slate-100 rounded" />
          <div className="h-8 w-64 bg-slate-100 rounded" />
        </div>
        <div className="h-12 w-40 bg-slate-100 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-80 bg-slate-50 rounded-[2.5rem]" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ hasPlans, activeTab }: { hasPlans: boolean; activeTab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-emerald-50/20 rounded-[3rem] border-2 border-dashed border-emerald-100">
      <div className="p-6 bg-white rounded-3xl shadow-xl shadow-emerald-900/5 mb-6">
        <AlertCircle size={40} className="text-emerald-500" />
      </div>
      <h3 className="text-xl font-black text-slate-800">
        {!hasPlans ? "Ready to launch?" : `No ${activeTab} plans`}
      </h3>
      <p className="text-slate-500 font-medium mt-2 max-w-xs text-center">
        {!hasPlans 
          ? "Create your first high-ticket nutrition plan and start helping clients today." 
          : "Try adjusting your filters to see your other offerings."}
      </p>
    </div>
  );
}