import type { Metadata } from "next";

import SessionDetailsClient from "@/components/nutritionist/sessions/details/SessionDetailsClient";

interface SessionDetailsPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Session Details | NutriWise",
  description: "View and manage your nutrition coaching session.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SessionDetailsPage({
  params,
}: SessionDetailsPageProps) {
  const { sessionId } = await params;

  return <SessionDetailsClient sessionId={sessionId} />;
}