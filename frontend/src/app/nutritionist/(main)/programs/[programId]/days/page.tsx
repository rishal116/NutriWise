import type { Metadata } from "next";

import { ProgramDaysList } from "@/components/nutritionist/program-day/list/ProgramDaysList";

interface ProgramDaysPageProps {
  params: Promise<{
    programId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Program Days | NutriWise",
  description:
    "View and manage the daily activities scheduled for a nutrition program.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProgramDaysPage({
  params,
}: ProgramDaysPageProps) {
  const { programId } = await params;

  return <ProgramDaysList programId={programId} />;
}
