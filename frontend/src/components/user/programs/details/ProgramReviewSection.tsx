"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Send, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { reviewService } from "@/services/user/review.service";

import type { ReviewResponseDTO } from "@/dtos/user/review/review.dto";

interface ProgramReviewSectionProps {
  nutritionistId: string;
  userPlanId: string;
}

interface ReviewStarsProps {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

function ReviewStars({
  rating,
  interactive = false,
  onChange,
}: ReviewStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= rating;

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              aria-label={`Rate ${star} out of 5`}
              onClick={() => onChange?.(star)}
              className="rounded-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            >
              <Star
                size={26}
                className={
                  active
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-100 text-slate-300"
                }
              />
            </button>
          );
        }

        return (
          <Star
            key={star}
            size={16}
            className={
              active
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-100 text-slate-200"
            }
          />
        );
      })}
    </div>
  );
}

export default function ProgramReviewSection({
  nutritionistId,
  userPlanId,
}: ProgramReviewSectionProps) {
  const [myReview, setMyReview] =
    useState<ReviewResponseDTO | null>(null);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(false);

  const loadMyReview = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const review =
        await reviewService.getMyReview(userPlanId);

      setMyReview(review);
      setRating(review?.rating ?? 0);
      setReviewText(review?.review ?? "");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userPlanId]);

  useEffect(() => {
    void loadMyReview();
  }, [loadMyReview]);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating.");
      return;
    }

    setSaving(true);

    try {
      const trimmedReview = reviewText.trim();

      if (myReview) {
        const updated =
          await reviewService.updateReview(
            myReview.id,
            {
              rating,
              review: trimmedReview || undefined,
            },
          );

        setMyReview(updated);
        setRating(updated.rating);
        setReviewText(updated.review ?? "");

        toast.success("Review updated successfully.");
        return;
      }

      const created =
        await reviewService.createReview(
          nutritionistId,
          {
            userPlanId,
            rating,
            review: trimmedReview || undefined,
          },
        );

      setMyReview(created);
      setRating(created.rating);
      setReviewText(created.review ?? "");

      toast.success("Review submitted successfully.");
    } catch {
      toast.error(
        myReview
          ? "Unable to update your review."
          : "Unable to submit your review.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your review?",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      await reviewService.deleteReview(myReview.id);

      setMyReview(null);
      setRating(0);
      setReviewText("");

      toast.success("Review deleted successfully.");
    } catch {
      toast.error("Unable to delete your review.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-slate-200" />
          <div className="h-12 w-32 rounded bg-slate-100" />
          <div className="h-28 rounded-xl bg-slate-100" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-10 text-center">
          <p className="text-sm font-semibold text-rose-700">
            Unable to load your review right now.
          </p>

          <button
            type="button"
            onClick={() => void loadMyReview()}
            className="mt-3 text-xs font-semibold text-rose-700 underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <MessageSquare size={18} />
        </div>

        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            Your Review
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
            Share your experience with this nutritionist.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Your rating
          </p>

          <ReviewStars
            rating={rating}
            interactive
            onChange={setRating}
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="program-review"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Your review
          </label>

          <textarea
            id="program-review"
            value={reviewText}
            onChange={(event) =>
              setReviewText(event.target.value)
            }
            maxLength={1000}
            rows={5}
            placeholder="Tell us about your experience with this nutritionist..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <div className="mt-1 text-right text-[11px] text-slate-400">
            {reviewText.length}/1000
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={saving || deleting || rating === 0}
            onClick={() => void handleSubmit()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Send size={15} />

            {saving
              ? "Saving..."
              : myReview
                ? "Update Review"
                : "Submit Review"}
          </button>

          {myReview && (
            <button
              type="button"
              disabled={saving || deleting}
              onClick={() => void handleDelete()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Trash2 size={15} />

              {deleting ? "Deleting..." : "Delete Review"}
            </button>
          )}
        </div>
      </div>

      {myReview && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Your submitted rating
          </p>

          <div className="mt-2 flex items-center gap-3">
            <ReviewStars rating={myReview.rating} />

            <span className="text-sm font-bold text-slate-900">
              {myReview.rating}/5
            </span>
          </div>
        </div>
      )}
    </section>
  );
}