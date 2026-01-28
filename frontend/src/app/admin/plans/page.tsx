"use client";

import { useEffect, useState } from "react";
import { adminPlanService } from "@/services/admin/adminPlan.service";

interface Plan {
  _id: string;
  title: string;
  price: number;
  currency: string;
  duration: number;
  status: "draft" | "published";
  nutritionistName: string;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await adminPlanService.getAllPlans();
      console.log(data);
      
      setPlans(data.data);
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setLoading(false);
    }
  };

  const publishPlan = async (planId: string) => {
    try {
      await adminPlanService.publishPlan(planId);
      fetchPlans();
    } catch (error) {
      console.error("Failed to publish plan", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Nutritionist Plans</h1>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Nutritionist</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Duration</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id} className="border-t">
                <td className="px-4 py-3">{plan.title}</td>
                <td className="px-4 py-3">{plan.nutritionistName}</td>
                <td className="px-4 py-3">
                  {plan.currency} {plan.price}
                </td>
                <td className="px-4 py-3">{plan.duration} days</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      plan.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {plan.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  {plan.status === "draft" && (
                    <button
                      onClick={() => publishPlan(plan._id)}
                      className="px-4 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      Publish
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {plans.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
