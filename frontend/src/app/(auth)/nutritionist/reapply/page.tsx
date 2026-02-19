"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/axios/api";
import { getUserId } from "@/utils/jwt";
import { userAuthService } from "@/services/user/userAuth.service";

export default function ReapplyPage() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchData = async () => {
    try {
      setChecking(true);

      const userId = getUserId();
      if (!userId) {
        router.replace("/");
        return;
      }

      // 1️⃣ Check status first
      const me = await userAuthService.getMe();
      const status = me?.user.nutritionistStatus;

      if (status === "approved") {
        router.replace("/nutritionist/dashboard");
        return;
      }

      if (status === "pending") {
        router.replace("/nutritionist/pending");
        return;
      }

      // 2️⃣ Only fetch rejection reason if rejected
      if (status === "rejected") {
        const rejectionRes = await api.get(
          `/nutritionist/rejection/${userId}`
        );

        const dto = rejectionRes.data?.data;
        setReason(dto?.rejectionReason || "No reason provided");
      } else {
        router.replace("/nutritionist/details");
      }
    } catch (err) {
      console.error(err);
      setReason("Failed to load rejection reason.");
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading application status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-28 p-8 bg-white shadow-xl rounded-2xl">
      {/* Status Badge */}
      <div className="flex justify-center mb-4">
        <span className="px-4 py-1 text-sm font-medium bg-red-100 text-red-600 rounded-full">
          Rejected
        </span>
      </div>

      <h1 className="text-3xl font-bold text-center text-red-600 mb-4">
        Application Rejected
      </h1>

      <p className="text-gray-700 mb-4 text-center">
        Unfortunately, your application was not approved.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <p className="text-sm text-gray-500 mb-1 font-semibold">
          Rejection Reason
        </p>
        <p className="text-gray-800">{reason}</p>
      </div>

      <p className="text-gray-600 text-center mb-6">
        You can update your details and submit your application again.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push("/nutritionist/details")}
          className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Reapply Now
        </button>

        <button
          onClick={fetchData}
          disabled={checking}
          className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-60"
        >
          {checking ? "Checking..." : "Refresh Status"}
        </button>
      </div>
    </div>
  );
}
