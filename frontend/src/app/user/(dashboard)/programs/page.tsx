import { Suspense } from "react";
import dynamic from "next/dynamic";

import { ProgramListSkeleton } from "@/components/user/programs/list/ProgramListSkeleton";

const ProgramsListing = dynamic(
  () =>
    import("@/components/user/programs/list/ProgramsListing").then(
      (module) => module.ProgramsListing,
    ),
  {
    loading: () => <ProgramListSkeleton />,
  },
);

export default function ProgramsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-6 w-1 rounded-full bg-emerald-600" />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          My Programs
        </h1>
      </div>

      <Suspense fallback={<ProgramListSkeleton />}>
        <ProgramsListing />
      </Suspense>
    </main>
  );
}
