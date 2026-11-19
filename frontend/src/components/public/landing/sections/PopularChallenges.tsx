
import Link from "next/link";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";

import type { PublicHomeChallengeDTO } from "@/dtos/public/home/public-home-challenge.dto";
import { publicHomepageService } from "@/services/public/public-homepage.service";

import HomepageDataSection from "./HomepageDataSection"; 

const challengeColors = [
  "from-emerald-600 to-teal-700",
  "from-teal-600 to-cyan-700",
  "from-green-700 to-emerald-600",
];

function ChallengeCard({
  challenge,
  index,
}: {
  challenge: PublicHomeChallengeDTO;
  index: number;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`relative flex h-44 items-end bg-gradient-to-br ${
          challengeColors[index % challengeColors.length]
        } p-6`}
      >
        <div className="absolute right-5 top-5 rounded-full bg-white/15 p-3 text-white backdrop-blur">
          <Sparkles size={23} />
        </div>

        <div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize text-white">
            {challenge.category.replaceAll("_", " ")}
          </span>

          <h3 className="mt-3 text-2xl font-bold text-white">
            {challenge.title}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {challenge.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium capitalize text-emerald-700">
            {challenge.difficulty}
          </span>

          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium capitalize text-teal-700">
            {challenge.accessType}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={16} />
            {challenge.durationDays} days
          </span>

          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:gap-3"
          >
            Explore
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function PopularChallenges() {
  return (
    <HomepageDataSection
      eyebrow="Build healthy habits"
      title="Popular challenges"
      description="Take small, meaningful steps toward a healthier lifestyle with our community challenges."
      href="/challenges"
      fetchData={publicHomepageService.getPopularChallenges}
      renderItem={(challenge, index) => (
        <ChallengeCard challenge={challenge} index={index} />
      )}
    />
  );
}
