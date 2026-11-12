import type { Metadata } from "next";
import dynamic from "next/dynamic";
import SessionCardSkeleton from "@/components/nutritionist/sessions/SessionCardSkeleton";

export const metadata: Metadata = {
  title: "My Sessions | NutriWise",
  description: "Manage your live and scheduled nutrition coaching sessions.",
  robots: { index: false, follow: false },
};

const SessionsListing = dynamic(
  () => import("@/components/nutritionist/sessions/SessionsListing"),
  {
    loading: () => (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <SessionCardSkeleton key={i} />
        ))}
      </div>
    ),
  },
);

export default function SessionsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
        My Sessions
      </h1>

      <SessionsListing />
    </main>
  );
}
