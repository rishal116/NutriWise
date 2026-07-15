"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  RotateCw,
  XCircle,
} from "lucide-react";
import { nutritionistApplicationService } from "@/services/nutritionist/nutriApplication.service";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useRouter } from "next/navigation";
import { userAuthService } from "@/services/user/userAuth.service";

type ApplicationStatus = "pending" | "approved" | "rejected";

interface ApplicationStatusResponse {
  applicationStatus: ApplicationStatus;
  rejectionReason?: string;
}

interface StatusContent {
  icon: React.ReactNode;
  iconBg: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export default function NutritionistApplicationStatusPage() {
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [status, setStatus] = useState<ApplicationStatusResponse | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const router = useRouter();

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setFetchError(false);
      const res = await nutritionistApplicationService.getApplicationStatus();
      setStatus(res.data);
    } catch (error) {
      setFetchError(true);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleAction = async (href: string) => {
    if (isActionLoading) return;

    setIsActionLoading(true);
    try {
      if (status?.applicationStatus === "approved") {
        await userAuthService.switchRole("nutritionist");
      }

      router.push(href);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsActionLoading(false);
    }
    // No `finally` reset here on the success path — router.push navigates
    // away, so leaving the button in its loading state avoids a flash
    // back to normal right before the route change.
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (fetchError || !status) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <XCircle className="mx-auto h-14 w-14 text-red-500" />
          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Couldn&apos;t load your application status
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Something went wrong while fetching your status. Please check your
            connection and try again.
          </p>
          <button
            onClick={fetchStatus}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            <RotateCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getStatusContent = (data: ApplicationStatusResponse): StatusContent => {
    switch (data.applicationStatus) {
      case "pending":
        return {
          icon: <Clock3 className="h-10 w-10 text-yellow-600" />,
          iconBg: "bg-yellow-100",
          badge: "Pending Review",
          badgeColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
          title: "Your application is under review",
          description:
            "Our admin team is reviewing your qualifications, certifications, and experience. This usually takes 2–5 business days.",
          buttonText: "Back to Home",
          buttonHref: "/",
        };

      case "approved":
        return {
          icon: <CheckCircle2 className="h-10 w-10 text-emerald-600" />,
          iconBg: "bg-emerald-100",
          badge: "Approved",
          badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
          title: "Congratulations, you're in!",
          description:
            "Your nutritionist application has been approved. You can now access your dashboard and start building client plans.",
          buttonText: "Go to Dashboard",
          buttonHref: "/nutritionist/dashboard",
        };

      case "rejected":
        return {
          icon: <XCircle className="h-10 w-10 text-red-500" />,
          iconBg: "bg-red-100",
          badge: "Not Approved",
          badgeColor: "bg-red-100 text-red-700 border-red-200",
          title: "Your application wasn't approved this time",
          description:
            "After review, we're unable to approve your application right now. You can update your details and reapply below.",
          buttonText: "Update & Reapply",
          buttonHref: "/user/nutritionist/application/form",
        };

      default: {
        const _exhaustiveCheck: never = data.applicationStatus;
        return _exhaustiveCheck;
      }
    }
  };

  const data = getStatusContent(status);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full ${data.iconBg}`}
          >
            {data.icon}
          </div>

          <span
            className={`mt-6 rounded-full border px-4 py-1 text-sm font-semibold ${data.badgeColor}`}
          >
            {data.badge}
          </span>

          <h1 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
            {data.title}
          </h1>

          <p className="mt-3 max-w-lg text-slate-600">{data.description}</p>
        </div>

        {status.applicationStatus === "pending" && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <p className="text-sm text-slate-600 text-center sm:text-left">
              We&apos;re reviewing your qualifications and experience —
              you&apos;ll get a notification as soon as a decision is made.
            </p>
          </div>
        )}

        {status.applicationStatus === "rejected" && status.rejectionReason && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5">
            <h3 className="font-semibold text-red-700">Rejection Reason</h3>
            <p className="mt-2 text-red-600">{status.rejectionReason}</p>
          </div>
        )}

        <div className="mt-10">
          <button
            onClick={() => handleAction(data.buttonHref)}
            disabled={isActionLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isActionLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              <>
                {data.buttonText}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
