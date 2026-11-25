import type { Metadata } from "next";

import UserSessionDetailsClient from "@/components/user/session/details/UserSessionDetailsClient";

interface UserSessionDetailsPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Session Details | NutriWise",
  description:
    "View your registered nutrition session details, schedule, registration status, and attendance information.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UserSessionDetailsPage({
  params,
}: UserSessionDetailsPageProps) {
  const { sessionId } = await params;

  return <UserSessionDetailsClient sessionId={sessionId} />;
}