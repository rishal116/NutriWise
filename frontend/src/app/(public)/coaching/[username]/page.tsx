"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";

import { nutritionistBrowsingService } from "@/services/user/nutriBrowsing.service";
import { reviewService } from "@/services/user/review.service";

import { NutritionistDetailDTO } from "@/dtos/user/nutri-browsing/nutri-detail.dto";
import { PublicReviewResponseDTO } from "@/dtos/user/review/review.dto";

import BreadcrumbHeader from "@/components/ui/nutritionists/BreadcrumbHeader";
import NutritionistProfileHero from "@/components/public/nutritionist/NutritionistProfileHero";
import NutritionistProfessionalDetails from "@/components/public/nutritionist/NutritionistProfessionalDetails";
import NutritionistSuccessHighlights from "@/components/public/nutritionist/NutritionistSuccessHighlights";
import NutritionistProfileContent from "@/components/public/nutritionist/NutritionistProfileContent";

export default function NutritionistProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();

  const [data, setData] = useState<NutritionistDetailDTO | null>(null);

  const [reviews, setReviews] = useState<PublicReviewResponseDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);

      try {
        const result =
          await nutritionistBrowsingService.getNutritionistProfile(username);

        if (!cancelled) {
          setData(result);
        }
      } catch {
        if (!cancelled) {
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    if (!data?.user.id) {
      return;
    }

    let cancelled = false;

    const fetchReviews = async () => {
      setReviewsLoading(true);

      try {


        const result = await reviewService.getNutritionistReviews(data.user.id);
        console.log(result);


        if (!cancelled) {
          setReviews(result);
        }
      } catch {
        if (!cancelled) {
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [data?.user.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />

          <p className="text-sm font-semibold tracking-wide text-slate-500">
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
            <Star className="text-rose-500" size={28} />
          </div>

          <p className="text-lg font-semibold text-rose-600">
            Nutritionist not found
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-emerald-700 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const { user, profile } = data;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <header className="border-b border-slate-200/80 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-700"
          >
            <ArrowLeft
              size={16}
              className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back
          </button>

          <h1 className="mb-1 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            Nutritionist Profile
          </h1>

          <BreadcrumbHeader
            title=""
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Get a Coach", href: "/coaching" },
              { label: "Nutritionists", href: "/coaching" },
              { label: user.fullName },
            ]}
          />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <NutritionistProfileHero data={data} username={username} />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <aside className="space-y-5 lg:col-span-4">
            <NutritionistProfessionalDetails profile={profile} />

            <NutritionistSuccessHighlights
              totalPeopleCoached={profile.totalPeopleCoached}
              totalExperienceYears={profile.totalExperienceYears}
              rating={profile.rating}
            />
          </aside>

          <section className="lg:col-span-8">
            <NutritionistProfileContent
              data={data}
              username={username}
              reviews={reviews}
              reviewsLoading={reviewsLoading}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
