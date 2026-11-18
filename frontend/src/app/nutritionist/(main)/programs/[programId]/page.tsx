import type { Metadata } from "next";

import { ProgramDetails } from "@/components/nutritionist/programs/details/ProgramDetails";

interface ProgramDetailsPageProps {
  params: Promise<{
    programId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Client Program Details | NutriWise",
  description:
    "View client nutrition program details, track progress, and manage coaching activities.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProgramDetailsPage({
  params,
}: ProgramDetailsPageProps) {
  const { programId } = await params;

  return <ProgramDetails programId={programId} />;
}
