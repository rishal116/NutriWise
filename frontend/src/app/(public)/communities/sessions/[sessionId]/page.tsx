import type { Metadata } from "next";

import PublicSessionDetailsClient from "@/components/public/sessions/details/PublicSessionDetailsClient";

interface PublicSessionPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Session Details | NutriWise",
    description:
      "Explore nutrition coaching sessions on NutriWise. View session details, schedule, host information, and registration options.",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PublicSessionPage({
  params,
}: PublicSessionPageProps) {
  const { sessionId } = await params;

  return <PublicSessionDetailsClient sessionId={sessionId} />;
}
