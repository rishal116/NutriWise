import { Clock, ShieldCheck, XCircle } from "lucide-react";

import type { ApplicationStatus } from "@/types/nutritionist.types";

const BANNERS = {
  approved: {
    icon: ShieldCheck,
    title: "Application approved",
    text: "This nutritionist is verified and active on NutriWise.",
    box: "border-admin-success/20 bg-admin-pastel-green",
    iconColor: "text-admin-success",
  },
  rejected: {
    icon: XCircle,
    title: "Application rejected",
    text: null,
    box: "border-admin-danger/20 bg-admin-danger-soft",
    iconColor: "text-admin-danger",
  },
  pending: {
    icon: Clock,
    title: "Awaiting review",
    text: "Approve or reject this application using the actions above.",
    box: "border-admin-warning/30 bg-admin-warning/10",
    iconColor: "text-admin-warning",
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
    <div
      className={`flex items-start gap-3 rounded-2xl border p-5 ${banner.box}`}
    >
      <Icon size={22} className={`mt-0.5 shrink-0 ${banner.iconColor}`} />
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-admin-text">{banner.title}</h2>
        {text && (
          <p className="mt-1 break-words text-sm font-medium text-admin-text/80">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}