import ProgramDetailsClient from "@/components/user/programs/details/ProgramDetailsClient";

interface ProgramDetailsPageProps {
  params: Promise<{
    programId: string;
  }>;
}

export default async function ProgramDetailsPage({
  params,
}: ProgramDetailsPageProps) {
  const { programId } = await params;

  return <ProgramDetailsClient programId={programId} />;
}
