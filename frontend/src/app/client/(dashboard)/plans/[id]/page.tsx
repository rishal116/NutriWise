"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userPlanService } from "@/services/user/userPlan.service";
import { userChatService } from "@/services/user/userChat.service";
import { userProgramService } from "@/services/user/userProgram.service";
import { reviewService } from "@/services/user/review.service";
import {
  Calendar,
  User,
  Loader2,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Zap,
  ChevronRight,
  Utensils,
  Dumbbell,
  Sparkles,
  Lock,
  Star,
  Trash2,
} from "lucide-react";


export default function PlanDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [taskLog, setTaskLog] = useState<any>(null);
  const [loadingDays, setLoadingDays] = useState(false);

  /* review state */
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [existingReview, setExistingReview] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  /* ── fetch plan ── */
  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await userPlanService.getPlanById(id as string);
        console.log(res);

        setPlan(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPlan();
  }, [id]);

  /* ── fetch days ── */
  useEffect(() => {
    async function fetchDays() {
      if (!plan?.program?.id) return;
      setLoadingDays(true);
      try {
        console.log(plan.id);

        const data = await userProgramService.getProgramDays(plan.program.id);
        console.log(data);

        const sorted = (data.data ?? []).sort(
          (a: any, b: any) => a.dayNumber - b.dayNumber,
        );
        setDays(sorted);
        if (sorted.length > 0) setSelectedDay(sorted[0].dayNumber);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDays(false);
      }
    }
    fetchDays();
  }, [plan]);

  /* ── fetch review ── */
  useEffect(() => {
    if (!plan?.nutritionist?.id) return;
    async function fetchReview() {
      try {
        const res = await reviewService.getMyReview(plan.nutritionist.id);
        if (res.data) {
          setExistingReview(res.data);
          setRating(res.data.rating);
          setReviewText(res.data.review || "");
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchReview();
  }, [plan]);

  /* ── helpers ── */
  const isMealChecked = (type: string) =>
    taskLog?.mealsCompleted?.includes(type);
  const isWorkoutChecked = (wId: string) =>
    taskLog?.workoutsCompleted?.includes(wId);
  const isHabitChecked = (title: string) =>
    taskLog?.habitsProgress?.some((h: any) => h.title === title);

  /* ── current program day (1-based) ── */
  const currentDay = plan?.program?.progress?.currentDay ?? 1;

  /* a day is unlocked if its dayNumber <= currentDay */
  const isDayUnlocked = (dayNumber: number) => dayNumber <= currentDay;

  const handleChatClick = async () => {
    try {
      await userChatService.createChat(
      plan.nutritionist.id,
      "user" 
    );
      router.push("/client/messages");
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  /* ── review actions ── */
  const handleSubmitReview = async () => {
    if (rating === 0) {
      setReviewError("Please select a rating");
      return;
    }
    setReviewError("");
    setSubmitting(true);
    try {
      let res;
      if (existingReview) {
        res = await reviewService.updateReview(existingReview.id, {
          rating,
          review: reviewText || undefined,
        });
      } else {
        res = await reviewService.submitReview({
          nutritionistId: plan.nutritionist.id,
          planId: plan.plan.id,
          rating,
          review: reviewText || undefined,
        });
      }
      setExistingReview(res.data);
      setRating(res.data.rating);
      setReviewText(res.data.review || "");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!existingReview) return;
    try {
      await reviewService.deleteReview(existingReview.id);
      setExistingReview(null);
      setRating(0);
      setReviewText("");
    } catch (err) {
      console.error(err);
    }
  };

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  /* ── loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <Loader2 className="w-9 h-9 text-emerald-500 animate-spin mx-auto" />
          <p className="text-emerald-700 font-semibold text-sm tracking-wide">
            Loading your plan…
          </p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center py-24 px-4">
        <div className="text-center space-y-3">
          <p className="text-gray-500 font-semibold text-sm">Plan not found</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-emerald-600 hover:underline font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const program = plan.program;
  const completion = Math.min(
    Math.round(program?.progress?.completion ?? 0),
    100,
  );

  const statusColor =
    plan.status === "ACTIVE"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : plan.status === "EXPIRED"
        ? "bg-gray-100 text-gray-500 border-gray-200"
        : "bg-red-100 text-red-600 border-red-200";

  const selectedDayData = days.find((d) => d.dayNumber === selectedDay);

  return (
    <div className="font-sans pb-12 space-y-6">
      {/* ── BACK + TITLE ── */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-3 group font-medium"
        >
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-1 transition-transform duration-200 flex-shrink-0"
          />
          Back to Plans
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent leading-tight">
          {plan.plan.title}
        </h1>
        <p className="text-gray-400 text-sm mt-1 font-medium">
          Personalised nutrition programme
        </p>
      </div>

      {/* ── HERO PROGRESS BANNER ── */}
      {program && (
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 sm:p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-12 -mt-12 blur-3xl pointer-events-none" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-0.5">
                  Your Progress
                </p>
                <p className="text-4xl font-black">{completion}%</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs font-bold">
                  <Zap size={12} className="flex-shrink-0" />
                  Day {program.progress.currentDay}
                </div>
                <p className="text-[10px] text-white/60 font-medium">
                  {program.progress.daysRemaining} days remaining
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <Target size={13} className="flex-shrink-0 text-white/60" />
              Goal:&nbsp;
              <span className="text-white capitalize font-bold">
                {program.goal.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── STATS ROW ── */}
      {program && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Current Day",
              value: program.progress.currentDay,
              icon: <Zap size={15} className="text-emerald-500" />,
              bg: "bg-emerald-50",
            },
            {
              label: "Days Left",
              value: program.progress.daysRemaining,
              icon: <Clock size={15} className="text-teal-500" />,
              bg: "bg-teal-50",
            },
            {
              label: "Completion",
              value: `${completion}%`,
              icon: <TrendingUp size={15} className="text-purple-500" />,
              bg: "bg-purple-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-2xl p-4 text-center border border-white shadow-sm`}
            >
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="text-lg font-black text-gray-900 leading-none mb-1">
                {s.value}
              </p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── PLAN DETAILS ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
          <div className="w-1 h-4 bg-emerald-500 rounded-full flex-shrink-0" />
          <h2 className="text-sm font-extrabold text-gray-900">Plan Details</h2>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
            <div className="bg-emerald-100 p-2 rounded-lg flex-shrink-0">
              <User size={14} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                Nutritionist
              </p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {plan.nutritionist.name}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
            <div className="bg-emerald-100 p-2 rounded-lg flex-shrink-0">
              <CheckCircle2 size={14} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">
                Status
              </p>
              <span
                className={`inline-flex text-[10px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${statusColor}`}
              >
                {plan.status}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
            <div className="bg-teal-100 p-2 rounded-lg flex-shrink-0">
              <Calendar size={14} className="text-teal-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                Start Date
              </p>
              <p className="text-sm font-bold text-gray-900">
                {new Date(plan.startDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
            <div className="bg-teal-100 p-2 rounded-lg flex-shrink-0">
              <Clock size={14} className="text-teal-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                End Date
              </p>
              <p className="text-sm font-bold text-gray-900">
                {new Date(plan.endDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROGRAMME DAYS ── */}
      {program && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3.5 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-4 bg-emerald-500 rounded-full flex-shrink-0" />
              <h2 className="text-sm font-extrabold text-gray-900">
                Programme Days
              </h2>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              Day {currentDay} of {days.length} unlocked
            </span>
          </div>

          {loadingDays ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>
          ) : days.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm font-medium">
                No days found for this programme
              </p>
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {/* Day selector pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                {days.map((d) => {
                  const unlocked = isDayUnlocked(d.dayNumber);
                  const active = selectedDay === d.dayNumber;
                  return (
                    <button
                      key={d.dayNumber}
                      onClick={() => unlocked && setSelectedDay(d.dayNumber)}
                      disabled={!unlocked}
                      title={
                        !unlocked ? `Unlocks on Day ${d.dayNumber}` : undefined
                      }
                      className={`flex-shrink-0 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                        !unlocked
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : active
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                      }`}
                    >
                      {!unlocked && <Lock size={9} className="flex-shrink-0" />}
                      Day {d.dayNumber}
                    </button>
                  );
                })}
              </div>

              {/* Selected day detail */}
              {selectedDayData && isDayUnlocked(selectedDayData.dayNumber) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-base">
                        Day {selectedDayData.dayNumber}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {selectedDayData.meals?.length ?? 0} meals&nbsp;·&nbsp;
                        {selectedDayData.workouts?.length ?? 0}{" "}
                        workouts&nbsp;·&nbsp;
                        {selectedDayData.habits?.length ?? 0} habits
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        router.push(
                          `/client/program/${plan.program.id}/day/${selectedDayData.dayNumber}`,
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors flex-shrink-0"
                    >
                      Open Day
                      <ChevronRight size={13} className="flex-shrink-0" />
                    </button>
                  </div>

                  {/* Meals */}
                  {selectedDayData.meals?.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-orange-100 p-1.5 rounded-lg flex-shrink-0">
                          <Utensils size={12} className="text-orange-500" />
                        </div>
                        <p className="text-[10px] font-extrabold text-gray-600 uppercase tracking-widest">
                          Meals
                        </p>
                      </div>
                      {selectedDayData.meals.map((meal: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 min-w-0"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isMealChecked(meal.type) ? "bg-emerald-500" : "bg-gray-300"}`}
                          />
                          <span className="text-sm text-gray-700 font-medium truncate capitalize">
                            {meal.type?.replace(/_/g, " ") ?? meal.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Workouts */}
                  {selectedDayData.workouts?.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0">
                          <Dumbbell size={12} className="text-blue-500" />
                        </div>
                        <p className="text-[10px] font-extrabold text-gray-600 uppercase tracking-widest">
                          Workouts
                        </p>
                      </div>
                      {selectedDayData.workouts.map((workout: any) => (
                        <div
                          key={workout.id}
                          className="flex items-center gap-2 min-w-0"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isWorkoutChecked(workout.id) ? "bg-emerald-500" : "bg-gray-300"}`}
                          />
                          <span className="text-sm text-gray-700 font-medium truncate">
                            {workout.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Habits */}
                  {selectedDayData.habits?.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-purple-100 p-1.5 rounded-lg flex-shrink-0">
                          <Sparkles size={12} className="text-purple-500" />
                        </div>
                        <p className="text-[10px] font-extrabold text-gray-600 uppercase tracking-widest">
                          Habits
                        </p>
                      </div>
                      {selectedDayData.habits.map((habit: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 min-w-0"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isHabitChecked(habit.title) ? "bg-emerald-500" : "bg-gray-300"}`}
                          />
                          <span className="text-sm text-gray-700 font-medium truncate">
                            {habit.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── CHAT CTA ── */}
      {plan.status === "ACTIVE" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="bg-emerald-100 p-2.5 rounded-xl flex-shrink-0">
              <MessageCircle size={17} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm mb-0.5">
                Need guidance?
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Chat directly with {plan.nutritionist.name} for personalised
                advice and progress updates.
              </p>
            </div>
          </div>
          <button
            onClick={handleChatClick}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-emerald-100 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
          >
            <MessageCircle size={15} className="flex-shrink-0" />
            Chat with {plan.nutritionist.name}
          </button>
        </div>
      )}

      {/* ── REVIEW SECTION (own card, always shown) ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3.5 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-4 bg-emerald-500 rounded-full flex-shrink-0" />
            <h2 className="text-sm font-extrabold text-gray-900">
              Rate Your Experience
            </h2>
          </div>
          {existingReview && (
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">
              Submitted
            </span>
          )}
        </div>

        <div className="p-5 space-y-5">
          <p className="text-xs text-gray-400 font-medium">
            How is your journey with {plan.nutritionist.name}?
          </p>

          {/* Stars */}
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform duration-150 hover:scale-125 active:scale-95"
                  >
                    <Star
                      size={32}
                      className={`transition-colors duration-150 ${
                        active
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200 fill-gray-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 h-5">
              {rating > 0 ? (
                <>
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-wide">
                    {ratingLabels[rating - 1]}
                  </span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <button
                    onClick={() => {
                      setRating(0);
                      setReviewError("");
                    }}
                    className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                  >
                    Clear
                  </button>
                </>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Tap a star to rate
                </span>
              )}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            placeholder="Share a few words about the programme or nutritionist…"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all resize-none"
          />

          {reviewError && (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1.5">
              <span className="w-1 h-1 bg-red-400 rounded-full flex-shrink-0" />
              {reviewError}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                existingReview
                  ? "bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                <Loader2 size={15} className="animate-spin flex-shrink-0" />
              ) : existingReview ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </button>

            {existingReview && (
              <button
                onClick={handleDeleteReview}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all"
              >
                <Trash2 size={14} className="flex-shrink-0" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
