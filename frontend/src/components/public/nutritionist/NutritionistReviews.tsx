import Image from "next/image";
import { Star } from "lucide-react";
import { PublicReviewResponseDTO } from "@/dtos/user/review/review.dto";

interface NutritionistReviewsProps {
  reviews: PublicReviewResponseDTO[];
  loading: boolean;
}

function ReviewStars({
  rating,
  size = 15,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
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

function formatReviewDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function NutritionistReviews({
  reviews,
  loading,
}: NutritionistReviewsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="h-10 w-20 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-32 rounded bg-slate-200" />
        </div>

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-xl border border-slate-200 p-5"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />

              <div className="flex-1">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-20 rounded bg-slate-200" />
                <div className="mt-5 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-4/5 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        totalReviews
      : 0;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-5 sm:p-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="text-center sm:min-w-24">
            <p className="text-4xl font-black leading-none text-slate-900 sm:text-5xl">
              {averageRating.toFixed(1)}
            </p>

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              out of 5
            </p>
          </div>

          <div className="h-px w-full bg-slate-200 sm:h-12 sm:w-px" />

          <div className="text-center sm:text-left">
            <ReviewStars rating={averageRating} size={18} />

            <p className="mt-2 text-sm font-medium text-slate-500">
              {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 px-5 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <Star className="text-emerald-300" size={28} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            No Reviews Yet
          </h3>

          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-slate-400">
            This nutritionist has not received any reviews yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-slate-200/80 bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
                  <Image
                    src={
                      review.user.profileImage || "/images/images.jpg"
                    }
                    alt={review.user.fullName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {review.user.fullName}
                      </p>

                      <div className="mt-1">
                        <ReviewStars rating={review.rating} />
                      </div>
                    </div>

                    <time
                      dateTime={review.createdAt}
                      className="shrink-0 text-xs text-slate-400"
                    >
                      {formatReviewDate(review.createdAt)}
                    </time>
                  </div>

                  {review.review && (
                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                      {review.review}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}