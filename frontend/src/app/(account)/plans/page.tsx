"use client";
import { useEffect, useState } from "react";
import { userPlanService } from "@/services/user/userPlan.service";

export default function UserPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await userPlanService.getMyPlans();
        setPlans(res.data);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your plans...</p>
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
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <div 
          key={p.id} 
          className="group relative bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl overflow-hidden"
        >
          {/* Accent bar */}
          <div className={`h-1.5 ${accentColor}`}></div>
          
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  {p.plan.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{p.nutritionist.name}</span>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(p.status)}`}>
                {p.status}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-4"></div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Valid Until</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(p.endDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              
              <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm hover:underline transition-colors">
                View Details →
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
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titleColor: "text-emerald-600",
      accentColor: "bg-gradient-to-r from-emerald-500 to-teal-500"
    },
    {
      items: expiredPlans,
      title: "Expired Plans",
      subtitle: "Plans that have reached their end date",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titleColor: "text-gray-600",
      accentColor: "bg-gradient-to-r from-gray-400 to-gray-500"
    },
    {
      items: cancelledPlans,
      title: "Cancelled Plans",
      subtitle: "Plans that were cancelled",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titleColor: "text-red-600",
      accentColor: "bg-gradient-to-r from-red-500 to-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            My Nutrition Plans
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and track your personalized nutrition journey
          </p>
        </div>

        {/* Empty State */}
        {plans.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Plans Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your nutrition journey by purchasing a personalized plan from one of our expert nutritionists.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              Browse Plans
            </button>
          </div>
        )}

        {/* Plan Sections */}
        {sectionConfigs.map((config) => 
          config.items.length > 0 && (
            <section key={config.title} className="space-y-5">
              <div className="flex items-center gap-3">
                <div className={`${config.titleColor}`}>
                  {config.icon}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${config.titleColor}`}>
                    {config.title}
                  </h2>
                  <p className="text-sm text-gray-500">{config.subtitle}</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-4"></div>
              </div>
              {renderPlans(config.items, config.accentColor)}
            </section>
          )
        )}
      </div>
    </div>
  );
}