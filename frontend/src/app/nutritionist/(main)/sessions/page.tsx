import type { Metadata } from "next";
import SessionsListing from "@/components/nutritionist/sessions/SessionsListing";

export const metadata: Metadata = {
  title: "My Sessions | NutriWise",
  description:
    "Manage your nutrition coaching sessions, view upcoming events, and track completed sessions.",
  robots: {
    index: false,
    follow: false,
  },
};

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
