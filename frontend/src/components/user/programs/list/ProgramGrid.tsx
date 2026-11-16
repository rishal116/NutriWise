import { ProgramCard } from "@/components/user/programs/list/ProgramCard";

import type { UserProgramCardResponseDTO } from "@/dtos/user/program/user-program-card-response.dto";

interface ProgramGridProps {
  programs: UserProgramCardResponseDTO[];
}

export function ProgramGrid({ programs }: ProgramGridProps) {
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
}
