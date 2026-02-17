"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userPlanService } from "@/services/user/userPlan.service";
import { userChatService } from "@/services/user/userChat.service";

export default function PlanDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await userPlanService.getPlanById(id as string);
        console.log(res);
        
        setPlan(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchPlan();
  }, [id]);

  const handleChatClick = async () => {
    try {
      console.log(plan.nutritionist.id);
      
      const conversation = await userChatService.createChat(
        plan.nutritionist.id
      );
      console.log(conversation);
      

      router.push(`/client/messages`);
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!plan) return <div className="p-10">Plan not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{plan.plan.title}</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <p><strong>Nutritionist:</strong> {plan.nutritionist.name}</p>
        <p><strong>Status:</strong> {plan.status}</p>
        <p><strong>Start Date:</strong> {new Date(plan.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(plan.endDate).toLocaleDateString()}</p>
      </div>

      {plan.status === "ACTIVE" && (
        <button
          onClick={handleChatClick}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          💬 Chat with {plan.nutritionist.name}
        </button>
      )}
    </div>
  );
}
