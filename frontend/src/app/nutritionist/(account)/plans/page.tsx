"use client";

import { useEffect, useState } from "react";
import { 
  Clock, Eye, FileText, Plus, 
  Search, MoreVertical, IndianRupee, 
  ArrowUpRight, Filter, AlertCircle 
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
  createdAt: string;
  updatedAt: string;
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
        const mappedPlans: Plan[] = res.data.data.map((p: any) => ({
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
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Subscription Plans</h1>
          <p className="text-slate-500 mt-1 text-sm">Review, edit, and monitor your nutrition offerings.</p>
        </div>
        <button
          onClick={() => router.push("/nutritionist/plans/create")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
        >
          <Plus size={20} /> Create New Plan
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-8">
          {["all", "published", "draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-sm font-bold capitalize transition-all relative ${
                activeTab === tab ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
        <div className="pb-3 text-xs text-slate-400 font-medium">
          Showing {filteredPlans.length} plans
        </div>
      </div>

      {/* CONTENT AREA */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden">
      <div className="p-6 flex-1">
        {/* Top Meta */}
        <div className="flex justify-between items-start mb-4">
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase ${
            plan.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
          }`}>
            {plan.status}
          </div>
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Clock size={14} /> {plan.durationInDays} Days
          </span>
        </div>

        {/* Title & Category */}
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {plan.title}
        </h3>
        <p className="text-xs font-medium text-slate-400 mb-4">{plan.category}</p>

        {/* Features Preview */}
        <div className="space-y-2 mb-6">
          {plan.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
              <div className="w-1 h-1 bg-emerald-400 rounded-full" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
          {plan.features.length > 3 && (
            <p className="text-[10px] text-slate-400 pl-3">+{plan.features.length - 3} more features</p>
          )}
        </div>
      </div>

      {/* Footer / Pricing */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Plan Price</p>
          <div className="flex items-center font-bold text-slate-800">
            <IndianRupee size={14} />
            <span className="text-lg">{plan.price.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
            <button 
              onClick={() => router.push(`/nutritionist/plans/edit/${plan.id}`)}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <FileText size={18} />
            </button>
            <button 
              onClick={() => router.push(`/nutritionist/plans/${plan.id}`)}
              className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all"
            >
              <Eye size={18} />
            </button>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-slate-100 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ hasPlans, activeTab }: { hasPlans: boolean; activeTab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
      <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
        <AlertCircle size={32} className="text-slate-300" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">
        {!hasPlans ? "No plans created yet" : `No ${activeTab} plans found`}
      </h3>
      <p className="text-sm text-slate-500 mb-6">
        {!hasPlans 
          ? "Start by creating your first subscription package for your clients." 
          : "Try switching filters or creating a new plan."}
      </p>
    </div>
  );
}