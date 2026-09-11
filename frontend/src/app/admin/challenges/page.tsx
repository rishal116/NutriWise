import type { Metadata } from "next";

import ChallengeList from "@/components/admin/challenge/ChallengeList";

import { adminChallengeServerService } from "@/services/server/admin/adminChallengeServer.service";

export const metadata: Metadata = {
  title: "Challenges | NutriWise Admin",
  description: "Manage and organize NutriWise health challenges.",
};

export default async function AdminChallengesPage() {
  const initialData = await adminChallengeServerService.getChallenges({
    limit: 12,
    sortBy: "newest",
  });

  return <ChallengeList initialData={initialData} />;
}
