"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Clock, IndianRupee, FileText, ArrowLeft } from "lucide-react";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";
import { toast } from "react-hot-toast";

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

export default function ViewPlanPage() {
  const router = useRouter();
  const params = useParams();
  console.log(params);
  
  const planId = params?.planId as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planId) return;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await nutritionistPlanService.getPlanById(planId);
        console.log(res);
        
        const p = res.data.data;

        setPlan({
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
        });
      } catch (err: any) {
        console.error("Failed to fetch plan", err);
        toast.error(err?.response?.data?.message || "Failed to load plan.");
        setError("Failed to load plan. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const getDurationLabel = (days: number) => {
    if (days === 30) return "1 Month";
    if (days === 90) return "3 Months";
    if (days === 180) return "6 Months";
    return `${days} Days`;
  };

  const getStatusBadge = (status: "draft" | "published") => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold uppercase";
    return status === "published"
      ? <span className={`${base} bg-green-100 text-green-800`}>Published</span>
      : <span className={`${base} bg-yellow-100 text-yellow-800`}>Draft</span>;
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading plan...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!plan) return <p className="text-center mt-10 text-gray-500">Plan not found.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Plan Header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-2">{plan.title}</h1>
        <p className="text-gray-500 mb-4">Category: <span className="font-medium">{plan.category}</span></p>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={16} /> <span>{getDurationLabel(plan.durationInDays)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <IndianRupee size={16} /> <span>{plan.price} {plan.currency}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <FileText size={16} /> {getStatusBadge(plan.status)}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">Features</h2>
        {plan.features.length ? (
          <ul className="list-disc list-inside space-y-1">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="text-gray-700">{feature}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No features listed.</p>
        )}
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-gray-700">{plan.description || "No description available."}</p>
      </div>
    </div>
  );
}
