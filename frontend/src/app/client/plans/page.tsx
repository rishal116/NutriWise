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
  ShoppingBag
} from "lucide-react";

export default function UserPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await userPlanService.getMyPlans();
        console.log(res);
        setPlans(res.data);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading your plans...</p>
        </div>
      </div>
    );
  }

  const activePlans = plans.filter(p => p.status === "ACTIVE");
  const expiredPlans = plans.filter(p => p.status === "EXPIRED");
  const cancelledPlans = plans.filter(p => p.status === "CANCELLED");

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      EXPIRED: "bg-gray-100 text-gray-600 border-gray-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200"
    };
    return badges[status as keyof typeof badges] || badges.EXPIRED;
  };

  const renderPlans = (items: any[], accentColor: string) => (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <div 
          key={p.id} 
          className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl overflow-hidden"
        >
          {/* Accent bar */}
          <div className={`h-1.5 ${accentColor}`}></div>
          
          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors truncate">
                  {p.plan.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{p.nutritionist.name}</span>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusBadge(p.status)}`}>
                {p.status}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-4"></div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Valid Until
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(p.endDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              
              <button
                onClick={() => router.push(`/client/plans/${p.id}`)}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const sectionConfigs = [
    {
      items: activePlans,
      title: "Active Plans",
      subtitle: "Your currently active nutrition plans",
      icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />,
      titleColor: "text-emerald-600",
      accentColor: "bg-gradient-to-r from-emerald-600 to-teal-600"
    },
    {
      items: expiredPlans,
      title: "Expired Plans",
      subtitle: "Plans that have reached their end date",
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      titleColor: "text-gray-600",
      accentColor: "bg-gradient-to-r from-gray-400 to-gray-500"
    },
    {
      items: cancelledPlans,
      title: "Cancelled Plans",
      subtitle: "Plans that were cancelled",
      icon: <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      titleColor: "text-red-600",
      accentColor: "bg-gradient-to-r from-red-500 to-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              My Nutrition Plans
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base lg:text-lg">
              Manage and track your personalized nutrition journey
            </p>
          </div>
        </div>

        {/* Empty State */}
        {plans.length === 0 && (
          <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 mb-6">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No Plans Yet</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
              Start your nutrition journey by purchasing a personalized plan from one of our expert nutritionists.
            </p>
            <button 
              onClick={() => router.push('/coaching')}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Plans
            </button>
          </div>
        )}

        {/* Plan Sections */}
        {sectionConfigs.map((config) => 
          config.items.length > 0 && (
            <section key={config.title} className="space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className={`${config.titleColor}`}>
                    {config.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className={`text-xl sm:text-2xl font-bold ${config.titleColor}`}>
                      {config.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
                  </div>
                </div>
                <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent sm:ml-4"></div>
              </div>
              {renderPlans(config.items, config.accentColor)}
            </section>
          )
        )}
      </div>
    </div>
  );
}