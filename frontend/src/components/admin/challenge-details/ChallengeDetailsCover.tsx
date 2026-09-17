import Image from "next/image";

import { Image as ImageIcon } from "lucide-react";

import { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

interface ChallengeDetailsCoverProps {
  challenge: AdminChallengeDetailsDTO;
}

export function ChallengeDetailsCover({
  challenge,
}: ChallengeDetailsCoverProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[3/1] w-full overflow-hidden bg-slate-100 sm:aspect-[3.5/1]">
        {challenge.coverImageUrl ? (
          <Image
            src={challenge.coverImageUrl}
            alt={challenge.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-emerald-50 to-slate-100">
            <ImageIcon className="h-8 w-8 text-slate-400" />

            <span className="mt-2 text-sm font-medium text-slate-400">
              No cover image available
            </span>
          </div>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-slate-950/5"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}