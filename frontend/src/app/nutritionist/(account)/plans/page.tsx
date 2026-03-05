"use client";

import { useEffect, useState } from "react";
import { 
  Clock, Eye, FileText, Plus, 
  IndianRupee, AlertCircle, TrendingUp, 
  ChevronRight, MoreHorizontal 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";

/* ============================== TYPES ============================== */
interface Plan {
  id: string;
  title: string;
  category: string;
  durationInDays: 30 | 90 | 180;
  price: number;
  status: "draft" | "published";
  features: string[];
  description: string;
}

export default function MyPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await nutritionistPlanService.getPlans();
        const mappedPlans = res.data.data.map((p: any) => ({
          id: p._id,
          title: p.title,
          category: p.category,
          durationInDays: p.durationInDays,
          price: p.price,
          status: p.status,
          features: p.features || [],
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
    <div className="space-y-10">
      
      {/* HEADER SECTION - Responsive Alignment */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <TrendingUp size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Service Offerings</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription Plans</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and monitor your nutrition packages.</p>
        </div>
        
        <button
          onClick={() => router.push("/nutritionist/plans/create")}
          className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-200/50 transition-all active:scale-95 sm:w-auto w-full"
        >
          <Plus size={18} strokeWidth={3} /> 
          <span>Create New Plan</span>
        </button>
      </div>

      {/* FILTER TABS - Minimalist Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex gap-8">
          {["all", "published", "draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-[13px] font-bold capitalize transition-all relative ${
                activeTab === tab ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          ))}
        </div>
        <div className="pb-4 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          {filteredPlans.length} Total Plans
        </div>
      </div>

      {/* CONTENT AREA - Responsive Grid */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} router={router} />
          ))}
        </div>
      ) : (
        <EmptyState hasPlans={plans.length > 0} activeTab={activeTab} />
      )}
    </div>
  );
}

/* ============================ SUB-COMPONENTS ============================ */

function PlanCard({ plan, router }: { plan: Plan; router: any }) {
  const isPublished = plan.status === "published";

  return (
    <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 flex flex-col overflow-hidden">
      <div className="p-8 flex-1">
        {/* Status & Menu */}
        <div className="flex justify-between items-start mb-6">
          <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
            isPublished ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
          }`}>
            {plan.status}
          </div>
          <button className="text-slate-300 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Info Area */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors mb-1">
            {plan.title}
          </h3>
          <div className="flex items-center gap-2">
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{plan.category}</span>
             <div className="w-1 h-1 bg-slate-200 rounded-full" />
             <span className="text-[11px] font-bold text-emerald-600/70 flex items-center gap-1 uppercase tracking-wider">
               <Clock size={12} /> {plan.durationInDays} Days
             </span>
          </div>
        </div>

        {/* Features Zone */}
        <div className="space-y-3 mb-4">
          {plan.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-sm text-slate-600 font-medium line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-0.5">Price Point</span>
          <div className="flex items-center font-black text-slate-900">
            <IndianRupee size={14} strokeWidth={3} />
            <span className="text-xl tracking-tighter">{plan.price.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => router.push(`/nutritionist/plans/edit/${plan.id}`)}
            className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
          >
            <FileText size={18} />
          </button>
          <button 
            onClick={() => router.push(`/nutritionist/plans/${plan.id}`)}
            className="flex items-center gap-2 pl-4 pr-3 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            <span className="text-xs">View</span>
            <ChevronRight size={16} strokeWidth={3} />
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