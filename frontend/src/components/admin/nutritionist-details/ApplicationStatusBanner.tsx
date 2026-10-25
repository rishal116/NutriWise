import { Clock, ShieldCheck, XCircle } from "lucide-react";

import type { ApplicationStatus } from "@/types/nutritionist.types";

const BANNERS = {
  approved: {
    icon: ShieldCheck,
    title: "Application approved",
    text: "This nutritionist is verified and active on NutriWise.",
    box: "border-emerald-100 bg-emerald-50",
    iconColor: "text-emerald-600",
    titleColor: "text-emerald-900",
    textColor: "text-emerald-700",
  },
  rejected: {
    icon: XCircle,
    title: "Application rejected",
    text: null,
    box: "border-rose-100 bg-rose-50",
    iconColor: "text-rose-500",
    titleColor: "text-rose-800",
    textColor: "text-rose-700",
  },
  pending: {
    icon: Clock,
    title: "Awaiting review",
    text: "Approve or reject this application using the actions above.",
    box: "border-amber-100 bg-amber-50",
    iconColor: "text-amber-600",
    titleColor: "text-amber-900",
    textColor: "text-amber-700",
  },
} as const;

interface ApplicationStatusBannerProps {
  status: ApplicationStatus;
  rejectionReason?: string;
}

export default function ApplicationStatusBanner({
  status,
  rejectionReason,
}: ApplicationStatusBannerProps) {
  if (status !== "approved" && status !== "rejected" && status !== "pending") {
    return null;
  }

  const banner = BANNERS[status];
  const Icon = banner.icon;
  const text = banner.text ?? rejectionReason;

  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-5 ${banner.box}`}>
      <Icon size={22} className={`mt-0.5 shrink-0 ${banner.iconColor}`} />
      <div className="min-w-0">
        <h2 className={`text-sm font-bold ${banner.titleColor}`}>{banner.title}</h2>
        {text && (
          <p className={`mt-1 break-words text-sm font-medium ${banner.textColor}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}