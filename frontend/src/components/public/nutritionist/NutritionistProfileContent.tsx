"use client";

import { useState } from "react";
import { Calendar, CreditCard, Star } from "lucide-react";
import Link from "next/link";

import { NutritionistDetailDTO } from "@/dtos/user/nutri-browsing/nutri-detail.dto";
import { PublicReviewResponseDTO } from "@/dtos/user/review/review.dto";

import NutritionistReviews from "@/components/public/nutritionist/NutritionistReviews";

interface NutritionistProfileContentProps {
  data: NutritionistDetailDTO;
  username: string;
  reviews: PublicReviewResponseDTO[];
  reviewsLoading: boolean;
}

type ActiveTab = "about" | "reviews";

interface RatingStarsProps {
  rating: number;
}

function RatingStars({ rating }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={18}
          className={
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-100 text-slate-200"
          }
        />
      ))}
    </div>
  );
}

export default function NutritionistProfileContent({
  data,
  username,
  reviews,
  reviewsLoading,
}: NutritionistProfileContentProps) {
  const [activeTab, setActiveTab] =
    useState<ActiveTab>("about");

  const { user, profile } = data;
  const firstName = user.fullName.split(" ")[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex border-b border-slate-200/80 bg-slate-50">
        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`flex-1 border-b-2 px-4 py-3.5 text-sm font-bold transition-colors sm:px-6 ${
            activeTab === "about"
              ? "border-emerald-600 bg-white text-emerald-700"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          About Me
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 border-b-2 px-4 py-3.5 text-sm font-bold transition-colors sm:px-6 ${
            activeTab === "reviews"
              ? "border-emerald-600 bg-white text-emerald-700"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            Reviews

            {profile.totalReviews > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  activeTab === "reviews"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {profile.totalReviews}
              </span>
            )}
          </span>
        </button>
      </div>

      <div className="p-5 sm:p-7 lg:p-8">
        {activeTab === "about" && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 flex items-center gap-2.5 text-xl font-bold text-slate-900 sm:text-2xl">
                <span className="h-7 w-1 rounded-full bg-emerald-600" />
                About {firstName}
              </h3>

              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                {profile.bio ||
                  "No bio available yet. This nutritionist is building their profile."}
              </p>
            </div>

            {profile.bio && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <h4 className="mb-1.5 flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <Calendar
                    size={15}
                    className="text-emerald-700"
                  />
                  Ready to start your journey?
                </h4>

                <p className="mb-4 text-xs leading-relaxed text-emerald-800/80 sm:text-sm">
                  Book a nutrition plan with {firstName} and get
                  personalised guidance tailored to your goals.
                </p>

                <Link
                  href={`/coaching/${username}/plans`}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                >
                  <CreditCard size={15} />
                  View Available Plans
                </Link>
              </div>
            )}

            {profile.totalReviews > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Client rating
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-3xl font-black text-slate-900">
                        {profile.rating.toFixed(1)}
                      </span>

                      <div>
                        <RatingStars rating={profile.rating} />

                        <p className="mt-1 text-xs text-slate-500">
                          {profile.totalReviews} review
                          {profile.totalReviews !== 1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("reviews")}
                    className="text-left text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 sm:text-right"
                  >
                    Read all reviews →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <NutritionistReviews
            reviews={reviews}
            loading={reviewsLoading}
          />
        )}
      </div>
    </div>
  );
}