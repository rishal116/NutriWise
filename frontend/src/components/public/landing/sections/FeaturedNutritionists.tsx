
import Link from "next/link";
import { ArrowUpRight, Award, Star } from "lucide-react";

import type { PublicHomeNutritionistDTO } from "@/dtos/public/home/public-home-nutritionist.dto";
import { publicHomepageService } from "@/services/public/public-homepage.service";

import HomepageDataSection from "./HomepageDataSection";

function NutritionistCard({
  nutritionist,
}: {
  nutritionist: PublicHomeNutritionistDTO;
}) {
  return (
    <article className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 text-xl font-bold text-emerald-700">
          {nutritionist.profileImage ? (
            <div
              role="img"
              aria-label={nutritionist.fullName}
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: `url("${nutritionist.profileImage}")`,
              }}
            />
          ) : (
            nutritionist.fullName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-bold text-slate-900">
            {nutritionist.fullName}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            @{nutritionist.username}
          </p>

          <div className="mt-2 flex items-center gap-1 text-sm text-amber-500">
            <Star size={15} fill="currentColor" />
            <span className="font-semibold text-slate-700">
              {nutritionist.rating.toFixed(1)}
            </span>
            <span className="text-slate-400">
              ({nutritionist.totalReviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {nutritionist.bio && (
        <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-600">
          {nutritionist.bio}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {nutritionist.specializations.slice(0, 3).map((specialization) => (
          <span
            key={specialization}
            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
          >
            {specialization}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Award size={15} className="text-emerald-600" />
          {nutritionist.totalPeopleCoached} people coached
        </div>

        <Link
          href={`/coaching/${nutritionist.username}`}
          aria-label={`View ${nutritionist.fullName}'s profile`}
          className="rounded-full p-2 text-emerald-600 transition hover:bg-emerald-50"
        >
          <ArrowUpRight size={19} />
        </Link>
      </div>
    </article>
  );
}

export default function FeaturedNutritionists() {
  return (
    <HomepageDataSection
      eyebrow="Expert guidance"
      title="Meet our nutritionists"
      description="Get personalized guidance from professionals who care about your health and wellness."
      href="/coaching"
      linkLabel="Explore nutritionists"
      fetchData={publicHomepageService.getFeaturedNutritionists}
      renderItem={(nutritionist) => (
        <NutritionistCard nutritionist={nutritionist} />
      )}
    />
  );
}
