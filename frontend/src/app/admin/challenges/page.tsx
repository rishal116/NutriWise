import type { Metadata } from "next";

import ChallengeList from "@/components/admin/challenge/ChallengeList";

export const metadata: Metadata = {
  title: "Challenge Management | NutriWise",
  robots: { index: false, follow: false },
};

export default function AdminChallengesPage() {
  return <ChallengeList />;
}