"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { userSessionService } from "@/services/user/session.service";

export default function SessionSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const sessionId = searchParams.get("session_id");

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<"success" | "failed" | "loading">(
        "loading"
    );

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                if (!sessionId) {
                    setStatus("failed");
                    return;
                }

                const res = await userSessionService.verifyPayment(sessionId);

                if (!res.success) {
                    throw new Error("Verification failed");
                }

                setStatus("success");
            } catch (err) {
                setStatus("failed");
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Verifying payment...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center">
            {status === "success" ? (
                <>
                    <h1 className="text-2xl font-bold text-green-600">
                        Payment Successful 🎉
                    </h1>
                    <p>Your session has been booked successfully.</p>

                    <button
                        onClick={() => router.push("/client/sessions")}
                        className="mt-4 rounded bg-black px-4 py-2 text-white"
                    >
                        Go to Sessions
                    </button>
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold text-red-600">
                        Payment Failed ❌
                    </h1>
                    <p>Please try again.</p>

                    <button
                        onClick={() => router.push("/sessions")}
                        className="mt-4 rounded bg-black px-4 py-2 text-white"
                    >
                        Back
                    </button>
                </>
            )}
        </div>
    );
}