import ProgramHealthSection from "./ProgramHealthSection";

interface ProgramHealthPanelProps {
  programId: string;
}

export default function ProgramHealthPanel({
  programId,
}: ProgramHealthPanelProps) {
  return <ProgramHealthSection programId={programId} />;
}
