import { Suspense } from "react";
import dynamic from "next/dynamic";

import { ProgramListingSkeleton } from "@/components/nutritionist/programs/list/ProgramListingSkeleton";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Programs | NutriWise",
  description:
    "Manage and track your clients' nutrition programs, monitor progress, and view program details.",
  robots: {
    index: false,
    follow: false,
  },
};

const ProgramListing = dynamic(
  () =>
    import("@/components/nutritionist/programs/list/ProgramListing").then(
      (module) => module.ProgramListing,
    ),
  {
    loading: () => <ProgramListingSkeleton />,
  },
);

export default function NutritionistProgramsPage() {
  return (
    <Suspense fallback={<ProgramListingSkeleton />}>
      <ProgramListing />
    </Suspense>
  );
}
