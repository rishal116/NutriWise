import type { Metadata } from "next";
import { Suspense } from "react";
import UserDashboardClient from "@/components/user/dashboard/UserDashboardClient";
import DashboardSkeleton from "@/components/user/dashboard/DashboardSkeleton";

export const metadata: Metadata = {
  title: "My Dashboard | NutriWise",
  description:
    "Track your nutrition coaching programs, daily activities, consultations, and wellness progress with NutriWise.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <UserDashboardClient />
    </Suspense>
  );
}