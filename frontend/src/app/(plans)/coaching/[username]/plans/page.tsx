"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { nutritionistBrowsingService } from "@/services/user/nutriBrowsing.service";
import { nutritionistPlanBrowsingService } from "@/services/user/nutriPanBrowsing.service";
import type { NutritionistDetailDTO } from "@/dtos/user/nutri-browsing/nutri-detail.dto";
import type { NutritionistPlanDTO } from "@/dtos/user/nutri-plan-browsing/nutri-plan.dto";
import { PLATFORM_FEATURES } from "@/constants/platform-features";
import BreadcrumbHeader from "@/components/ui/nutritionists/BreadcrumbHeader";
import { useAppSelector } from "@/redux/hooks";
import {
  CheckCircle,
  ArrowLeft,
  Award,
  Calendar,
  Users,
  TrendingUp,
  Star,
  Sparkles,
  Clock,
  IndianRupee,
  DollarSign,
} from "lucide-react";

function formatLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatPrice(price: number, currency: NutritionistPlanDTO["currency"]) {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function CurrencyIcon({
  currency,
  size,
  className,
}: {
  currency: NutritionistPlanDTO["currency"];
  size?: number;
  className?: string;
}) {
  return currency === "INR" ? (
    <IndianRupee size={size} className={className} strokeWidth={3} />
  ) : (
    <DollarSign size={size} className={className} strokeWidth={3} />
  );
}

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Sparkles,
    title: "Choose a Plan",
    desc: "Select a programme aligned with your fitness goals.",
  },
  {
    step: "02",
    icon: Users,
    title: "Get Your Coach",
    desc: "A professional nutritionist will guide and monitor your progress.",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Start Growing",
    desc: "Follow your plan with expert support and measurable results.",
  },
];

export default function NutritionistPlansPage() {
  const { username } = useParams();
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [data, setData] = useState<NutritionistDetailDTO | null>(null);
  const [plans, setPlans] = useState<NutritionistPlanDTO[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<NutritionistPlanDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const profileRes =
          await nutritionistBrowsingService.getNutritionistProfile(
            username as string,
          );
        setData(profileRes);
        setIsOwnProfile(user?.username === profileRes.user.username);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }

      try {
        const plansRes = await nutritionistPlanBrowsingService.getPlans(
          username as string,
        );
        const published = plansRes ?? [];
        setPlans(published);
        setSelectedPlan(published[0] ?? null);
      } catch {
        setPlans([]);
        setSelectedPlan(null);
      }
    }
    fetchData();
  }, [username, user?.username]);

  /* ─────────────────── LOADING ─────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />
          <p className="text-emerald-700 font-semibold text-sm tracking-wide">
            Loading plans…
          </p>
        </div>
      </div>
    );
  }

  /* ─────────────────── NOT FOUND ─────────────────── */
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-rose-600 font-semibold text-lg">Profile not found</p>
      </div>
    );
  }

  const { user: nutritionist, profile } = data;
  const isTopCoach = profile.coachLevel === "top_coach";

  const stats = [
    {
      icon: Star,
      label: "Rating",
      value: `${profile.rating?.toFixed(1) ?? "0.0"}/5`,
      badgeClass: "bg-amber-100/80 text-amber-700",
    },
    {
      icon: Users,
      label: "Clients",
      value: profile.totalPeopleCoached ?? 0,
      badgeClass: "bg-sky-100/80 text-sky-700",
    },
    {
      icon: TrendingUp,
      label: "Experience",
      value: `${profile.totalExperienceYears ?? 0} yrs`,
      badgeClass: "bg-emerald-100/80 text-emerald-700",
    },
  ] as const;

  /* ─────────────────── PAGE ─────────────────── */
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-36">
      {/* ── TOP HEADER ── */}
      <div className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700 transition-colors duration-150 mb-4 group font-medium"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-200 flex-shrink-0"
            />
            Back to Profile
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight mb-1">
            Choose Your Plan
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mb-4">
            Select a personalised nutrition programme designed for sustainable,
            lasting results.
          </p>

          <BreadcrumbHeader
            title=""
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Get a Coach", href: "/coaching" },
              { label: "Fitness & Nutrition", href: "#" },
              { label: nutritionist.fullName, href: `/coaching/${username}` },
              { label: "Plans" },
            ]}
          />
        </div>
      </div>

      {/* ── PROFILE HERO CARD (matches Details page) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1 min-w-0">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full ring-4 ring-white shadow-lg overflow-hidden">
                  <Image
                    src={nutritionist.profileImage || "/images/images.jpg"}
                    alt={nutritionist.fullName}
                    fill
                    sizes="(min-width: 1024px) 144px, (min-width: 640px) 128px, 112px"
                    className="object-cover"
                  />
                </div>
                {isTopCoach && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1.5 shadow-sm">
                    <Award className="text-white" size={15} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug truncate">
                    {nutritionist.fullName}
                  </h2>
                  <span
                    className={`flex-shrink-0 inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full border ${
                      isTopCoach
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {isTopCoach ? "★ Top Coach" : formatLabel(profile.coachLevel)}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-5">
                  Certified Nutrition Coach
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.badgeClass}`}
                      >
                        <s.icon size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {s.label}
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {s.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ── LEFT — PLAN LIST ── */}
          <div className="lg:col-span-7 space-y-4">
            <div className="mb-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Available Plans
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Select the plan that best fits your goals and lifestyle
              </p>
            </div>

            {plans.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-3">
                  <Sparkles className="text-emerald-600" size={22} />
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  No plans available at the moment
                </p>
              </div>
            ) : (
              plans.map((plan, index) => {
                const isSelected = selectedPlan?.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`group cursor-pointer rounded-2xl p-5 sm:p-6 border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 shadow-lg"
                        : "border-slate-200/80 bg-white hover:border-emerald-300 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: title, meta */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors duration-150 truncate">
                            {plan.title}
                          </h3>
                          {index === 0 && (
                            <span className="flex-shrink-0 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>

                        {/* Duration + specialization */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium mb-3">
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-emerald-600 flex-shrink-0" />
                            {plan.durationDays} days
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={13} className="text-emerald-600 flex-shrink-0" />
                            {formatLabel(plan.specialization)}
                          </span>
                        </div>
                      </div>

                      {/* Right: price + radio */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                            Price
                          </p>
                          <div className="text-2xl font-bold text-emerald-700">
                            {formatPrice(plan.price, plan.currency)}
                          </div>
                        </div>

                        <div
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0 ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600"
                              : "border-slate-300 group-hover:border-emerald-300"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle className="text-white" size={16} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── RIGHT — DETAILS PANEL ── */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-8 sticky top-24">
              {selectedPlan ? (
                <div className="space-y-6">
                  {/* Plan header */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug mb-1">
                      {selectedPlan.title}
                    </h3>
                    <p className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Calendar size={14} className="text-emerald-600 flex-shrink-0" />
                      {selectedPlan.durationDays}-day programme
                    </p>
                  </div>

                  {/* Description */}
                  {selectedPlan.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedPlan.description}
                    </p>
                  )}

                  {/* Investment — solid emerald-700 highlight panel, matching Details page's "Success Highlights" */}
                  <div className="bg-emerald-700 rounded-2xl p-6 text-white shadow-sm">
                    <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                      Total Investment
                    </p>
                    <div className="flex items-end gap-1">
                      <CurrencyIcon
                        currency={selectedPlan.currency}
                        size={28}
                        className="text-white mb-0.5 flex-shrink-0"
                      />
                      <span className="text-4xl font-bold text-white leading-none">
                        {selectedPlan.price}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 mt-2 font-medium">
                      Approx{" "}
                      <strong className="text-white">
                        {formatPrice(
                          selectedPlan.price / selectedPlan.durationDays,
                          selectedPlan.currency,
                        )}
                      </strong>{" "}
                      per day
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900">
                      <div className="w-1 h-5 bg-emerald-600 rounded-full flex-shrink-0" />
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedPlan.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-slate-700 font-medium leading-snug"
                        >
                          <CheckCircle
                            className="text-emerald-600 flex-shrink-0 mt-0.5"
                            size={15}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Platform features */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900">
                      <div className="w-1 h-5 bg-emerald-600 rounded-full flex-shrink-0" />
                      Also Included With Every Plan
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {PLATFORM_FEATURES.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-xs text-slate-600 font-medium leading-snug"
                        >
                          <CheckCircle
                            className="text-emerald-600 flex-shrink-0 mt-0.5"
                            size={13}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro tip */}
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                    <p className="text-xs text-sky-900 leading-relaxed">
                      <strong>Pro Tip:</strong> This plan focuses on
                      sustainable results with expert guidance throughout your
                      journey.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4">
                    <IndianRupee className="text-emerald-600" size={28} />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">
                    Select a plan to see full details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            How Our Programme Works
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            A simple, proven process to help you achieve your wellness goals.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 top-0 h-full w-px bg-emerald-200 -translate-x-1/2 hidden md:block" />

          <div className="space-y-10">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                className={`relative flex flex-col md:flex-row items-center gap-6 ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Card */}
                <div className="bg-white shadow-xs border border-slate-200/80 rounded-2xl p-6 w-full md:w-[45%] hover:shadow-lg transition-shadow duration-300">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-700 mb-4">
                    <item.icon size={20} />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">
                    Step {item.step}
                  </p>
                  <h3 className="text-base font-bold tracking-tight text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Circle node on the line */}
                <div className="hidden md:flex w-10 h-10 rounded-full bg-emerald-700 items-center justify-center text-white text-xs font-bold shadow-sm ring-4 ring-white z-10 flex-shrink-0">
                  {item.step}
                </div>

                <div className="hidden md:block w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STICKY CHECKOUT BAR ── */}
      {selectedPlan && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xs border-t border-slate-200/80 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Selected plan summary */}
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                Selected Plan
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <p className="font-bold text-slate-900 text-base sm:text-lg leading-none">
                  {selectedPlan.title}
                </p>
                <span className="text-slate-200 select-none">|</span>
                <p className="font-bold text-emerald-700 text-base sm:text-lg flex items-center leading-none">
                  {formatPrice(selectedPlan.price, selectedPlan.currency)}
                </p>
              </div>
            </div>

            {/* CTA */}
            {isOwnProfile ? (
              <button
                disabled
                className="w-full sm:w-auto bg-slate-100 text-slate-400 px-8 py-3.5 rounded-xl text-sm font-semibold cursor-not-allowed select-none"
              >
                Own Profile — Cannot Select
              </button>
            ) : (
              <button
                onClick={() => router.push(`/checkout?plan=${selectedPlan.slug}`)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm sm:text-base font-semibold rounded-xl shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Proceed to Checkout</span>
                <ArrowLeft className="rotate-180 flex-shrink-0" size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}