
import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";

interface SessionOverviewProps {
  session: PublicSessionDetailsResponseDTO;
}

export default function SessionOverview({
  session,
}: SessionOverviewProps) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-8">
      <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
        {session.type.replaceAll("_", " ")}
      </span>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {session.title}
      </h1>

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        {session.description}
      </p>
    </section>
  );
}
