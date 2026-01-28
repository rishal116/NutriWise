"use client";

import { useEffect, useState } from "react";
import { nutritionistSubscriptionService } from "@/services/nutritionist/nutritionistSubscription.service";

interface NutritionistSubscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    title: string;
    price: number;
    durationInDays: number;
  };
}

export default function NutritionistClient() {
  const [subscriptions, setSubscriptions] = useState<NutritionistSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await nutritionistSubscriptionService.getSubscriptions();
      console.log("API RESPONSE:", res);

      setSubscriptions(res.data);
    } catch (error) {
      console.error("Failed to fetch nutritionist subscriptions", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-lg">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Clients</h1>

      {subscriptions.length === 0 ? (
        <p className="text-gray-500 text-center">
          No users have purchased your plans yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-gray-700 font-semibold">Client</th>
                <th className="p-3 text-left text-gray-700 font-semibold">Plan</th>
                <th className="p-3 text-left text-gray-700 font-semibold">Status</th>
                <th className="p-3 text-left text-gray-700 font-semibold">Start Date</th>
                <th className="p-3 text-left text-gray-700 font-semibold">End Date</th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                  <td className="p-3">
                    <div className="font-medium text-gray-800">{sub.user.name}</div>
                    <div className="text-sm text-gray-500">{sub.user.email}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-medium text-gray-800">{sub.plan.title}</div>
                    <div className="text-sm text-gray-500">
                      ₹{sub.plan.price} • {sub.plan.durationInDays} days
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        sub.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>

                  <td className="p-3 text-gray-700">{new Date(sub.startDate).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-700">{new Date(sub.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
