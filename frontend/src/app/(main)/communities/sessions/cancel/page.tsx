"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SessionCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("sessionId");

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-orange-500">
        Payment Cancelled
      </h1>

      {sessionId && (
        <p className="mt-2 text-gray-600">
          Session ID: {sessionId}
        </p>
      )}

      <p className="mt-2">You can try booking again anytime.</p>

      <button
        onClick={() => router.push("/communities/sessions")}
        className="mt-4 rounded bg-black px-4 py-2 text-white"
      >
        Back to Sessions
      </button>
    </div>
  );
}