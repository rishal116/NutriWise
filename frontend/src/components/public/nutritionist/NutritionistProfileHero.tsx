"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Award,
  CreditCard,
  Star,
  Users,
} from "lucide-react";

import { NutritionistDetailDTO } from "@/dtos/user/nutri-browsing/nutri-detail.dto";

interface NutritionistProfileHeroProps {
  data: NutritionistDetailDTO;
  username: string;
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function NutritionistProfileHero({
  data,
  username,
}: NutritionistProfileHeroProps) {
  const { user, profile } = data;
  const isTopCoach = profile.coachLevel === "top_coach";

  const stats = [
    {
      label: "Rating",
      value: `${profile.rating.toFixed(1)}/5`,
      icon: Star,
      className: "bg-amber-100 text-amber-700",
    },
    {
      label: "Clients",
      value: profile.totalPeopleCoached,
      icon: Users,
      className: "bg-sky-100 text-sky-700",
    },
    {
      label: "Experience",
      value: `${profile.totalExperienceYears} yrs`,
      icon: Activity,
      className: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:p-9">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-white shadow-lg sm:h-32 sm:w-32 lg:h-36 lg:w-36">
              <Image
                src={user.profileImage || "/images/images.jpg"}
                alt={user.fullName}
                fill
                sizes="(min-width: 1024px) 144px, (min-width: 640px) 128px, 112px"
                className="object-cover"
              />
            </div>

            {isTopCoach && (
              <div className="absolute -right-1 -top-1 rounded-full bg-amber-500 p-1.5 shadow-sm">
                <Award className="text-white" size={15} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
              <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {user.fullName}
              </h2>

              <span
                className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${
                  isTopCoach
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {isTopCoach
                  ? "★ Top Coach"
                  : formatLabel(profile.coachLevel)}
              </span>
            </div>

            <p className="mt-2 text-sm font-medium text-slate-400">
              Certified Nutrition Coach
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-4 sm:justify-start">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${stat.className}`}
                    >
                      <Icon size={15} />
                    </div>

                    <div className="text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {stat.label}
                      </p>

                      <p className="text-sm font-bold text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Link
          href={`/coaching/${username}/plans`}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg sm:w-auto"
        >
          <CreditCard size={17} />
          View Plans
        </Link>
      </div>
    </div>
  );
}