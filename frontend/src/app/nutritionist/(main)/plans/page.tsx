import type { Metadata } from "next";
import dynamic from "next/dynamic";
import PlanSkeleton from "@/components/nutritionist/plans/list/PlanSkeleton";

export const metadata: Metadata = {
  title: "My Nutrition Plans | NutriWise",
  description: "Create and manage your nutrition plans.",
  robots: { index: false, follow: false },
};

const MyPlansClient = dynamic(
  () => import("@/components/nutritionist/plans/list/MyPlansClient"),
  { loading: () => <PlanSkeleton /> },
);

export default function MyPlansPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
        My Nutrition Plans
      </h1>

      <MyPlansClient />
    </main>
  );
}