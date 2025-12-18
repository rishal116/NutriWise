"use client";

import { useEffect, useState } from "react";
import { Clock, IndianRupee, Eye, FileText } from "lucide-react";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";

interface Plan {
  id: string;
  title: string;
  category: string;
  durationInDays: 30 | 90 | 180;
  price: number;
  status: "draft" | "published";
  approvalStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function MyPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await nutritionistPlanService.getPlans();
        setPlans(res.data.data); // Access nested array
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

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700"; // green
      case "pending":
        return "bg-yellow-100 text-yellow-700"; // yellow
      case "draft":
        return "bg-gray-100 text-gray-600"; // gray
      case "rejected":
        return "bg-red-100 text-red-700"; // optional
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading plans...
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
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors">
                        {plan.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">{plan.category}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusStyle(
                        plan.approvalStatus
                      )}`}
                    >
                      {plan.approvalStatus.toUpperCase()}
                    </span>
                  </div>

                  {/* Duration & Price */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-green-500" />
                      <span>{getDurationLabel(plan.durationInDays)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IndianRupee size={16} className="text-green-600" />
                      <span className="font-semibold">₹{plan.price}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">
                      <Eye size={16} /> View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-400 text-white font-medium rounded-xl hover:shadow-lg">
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
