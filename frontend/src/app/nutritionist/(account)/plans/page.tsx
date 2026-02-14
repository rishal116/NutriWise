"use client";

import { useEffect, useState } from "react";
import { Clock, Eye, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";

interface Plan {
  id: string;
  title: string;
  category: string;
  durationInDays: 30 | 90 | 180;
  price: number;
  status: "draft" | "published";
  currency: string;
  features: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

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
          currency: p.currency,
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

  const getDurationLabel = (days: number) => {
    if (days === 30) return "1 Month";
    if (days === 90) return "3 Months";
    if (days === 180) return "6 Months";
    return `${days} Days`;
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return currency + " ";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <div className="loader mb-4"></div>
        <p>Loading plans...</p>
        <style jsx>{`
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #34d399;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            My Plans
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage all your created nutrition plans
          </p>
        </div>

        {/* Plans Grid */}
        {plans.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 overflow-hidden group"
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      plan.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {plan.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  {/* Title & Category */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors">
                        {plan.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">{plan.category}</p>

                      {/* Features */}
                      {plan.features.length > 0 && (
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          {plan.features.map((f, idx) => (
                            <li key={idx}>• {f}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Duration & Price */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-green-500" />
                      <span>{getDurationLabel(plan.durationInDays)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">
                        {getCurrencySymbol(plan.currency)}
                        {plan.price}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
  if (!plan.id) return console.error("Plan ID missing");
  router.push(`/nutritionist/plans/${plan.id}`);
}}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200"
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      onClick={() => router.push(`/nutritionist/plans/edit/${plan.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-400 text-white font-medium rounded-xl hover:shadow-lg"
                    >
                      <FileText size={16} /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {plans.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <FileText size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No plans yet
            </h3>
            <p className="text-gray-500">
              Create your first nutrition plan to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
