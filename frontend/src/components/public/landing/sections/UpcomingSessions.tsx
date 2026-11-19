
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";

import type { PublicHomeSessionDTO } from "@/dtos/public/home/public-home-session.dto";
import { publicHomepageService } from "@/services/public/public-homepage.service";

import HomepageDataSection from "./HomepageDataSection";

function UpcomingSessionCard({
  session,
}: {
  session: PublicHomeSessionDTO;
}) {
  const scheduledDate = new Date(session.scheduledAt);

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
          {session.type.replaceAll("_", " ")}
        </span>

        <span className="text-xs font-medium text-slate-500">
          {session.pricing.type === "free"
            ? "Free"
            : `${session.pricing.currency} ${session.pricing.amount}`}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {session.title}
      </h3>

      {session.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {session.description}
        </p>
      )}

      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-emerald-600" />
          {scheduledDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {" · "}
          {scheduledDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div className="flex items-center gap-2">
          <Clock3 size={16} className="text-emerald-600" />
          {session.durationInMinutes} minutes
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-400">Hosted by</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {session.nutritionist.fullName}
          </p>
        </div>

        <Link
          href="/communities/sessions"
          aria-label={`Explore ${session.title}`}
          className="rounded-full bg-emerald-50 p-2.5 text-emerald-700 transition hover:bg-emerald-100"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}

export default function UpcomingSessions() {
  return (
    <HomepageDataSection
      eyebrow="Learn and connect"
      title="Upcoming live sessions"
      description="Join expert-led sessions, learn something new, and connect with the NutriWise community."
      href="/communities/sessions"
      fetchData={publicHomepageService.getUpcomingSessions}
      renderItem={(session) => (
        <UpcomingSessionCard session={session} />
      )}
    />
  );
}
