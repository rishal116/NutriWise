"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/axios/api";
import { getUserId } from "@/utils/jwt";

export default function Reapply() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReason = async () => {
      try {
        const userId = getUserId();

        if (!userId) {
          setReason("User not authenticated.");
          return;
        }

        const res = await api.get(`/nutritionist/rejection/${userId}`);

        // ✨ New DTO format: res.data.data.rejectionReason
        const dto = res.data?.data;

        setReason(dto?.rejectionReason || "No reason provided");
      } catch (err) {
        setReason("Failed to load reason");
      } finally {
        setLoading(false);
      }
    };

    fetchReason();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-24 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-red-600 mb-3">Application Rejected</h1>

      {loading ? (
        <p className="text-gray-600">Loading reason...</p>
      ) : (
        <>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Reason:</span> {reason}
          </p>

          <p className="text-gray-700 mb-4">You can update your details and submit again.</p>

          <button
            onClick={() => router.push("/nutritionist/details")}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Reapply
          </button>
        </>
      )}
    </div>
  );
}
