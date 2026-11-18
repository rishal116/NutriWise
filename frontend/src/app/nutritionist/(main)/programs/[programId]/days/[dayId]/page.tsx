import type { Metadata } from "next";

import { ProgramDayDetails } from "@/components/nutritionist/program-day/details/ProgramDayDetails";

interface ProgramDayDetailsPageProps {
  params: Promise<{
    programId: string;
    dayId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Program Day Details | NutriWise",
  description: "View the activities and schedule for a nutrition program day.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProgramDayDetailsPage({
  params,
}: ProgramDayDetailsPageProps) {
  const { programId, dayId } = await params;

  return <ProgramDayDetails programId={programId} dayId={dayId} />;
}
