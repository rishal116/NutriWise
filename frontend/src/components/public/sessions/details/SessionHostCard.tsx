
import Image from "next/image";
import { UserRound } from "lucide-react";

import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";

interface SessionHostCardProps {
  session: PublicSessionDetailsResponseDTO;
}

export default function SessionHostCard({
  session,
}: SessionHostCardProps) {
  const nutritionist = session.nutritionist;

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Hosted by
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-emerald-100 ring-2 ring-emerald-50">
          {nutritionist.profileImage ? (
            <Image
              src={nutritionist.profileImage}
              alt={nutritionist.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserRound className="h-6 w-6 text-emerald-600" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="truncate font-semibold text-slate-900">
            {nutritionist.name}
          </h2>

          <p className="mt-0.5 text-sm text-teal-600">
            NutriWise Nutritionist
          </p>
        </div>
      </div>
    </section>
  );
}
