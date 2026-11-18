import type { Metadata } from "next";

import { EditProgramDay } from "@/components/nutritionist/program-day/edit/EditProgramDay";

interface EditProgramDayPageProps {
  params: Promise<{
    programId: string;
    dayId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Program Day | NutriWise",
  description: "Edit activities and schedules for a nutrition program day.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditProgramDayPage({
  params,
}: EditProgramDayPageProps) {
  const { programId, dayId } = await params;

  return (
    <EditProgramDay
      programId={programId}
      dayId={dayId}
    />
  );
}