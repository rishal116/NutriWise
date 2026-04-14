"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { nutritionistListService } from "@/services/user/nutritionistList.service";
import { NutritionistProfileDTO } from "@/constants/nutritionist/nutritionistProfile.constants";
import BreadcrumbHeader from "@/components/ui/nutritionists/BreadcrumbHeader";
import {
  CheckCircle,
  ArrowLeft,
  Award,
  Calendar,
  Users,
  TrendingUp,
  Sparkles,
  Clock,
  IndianRupee,
} from "lucide-react";
import { getUserId, getUserRole } from "@/utils/jwt";

interface Plan {
  id: string;
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  features: string[];
  tags?: string[];
}

export default function NutritionistPlansPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profile, setProfile] = useState<NutritionistProfileDTO | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, plansRes] = await Promise.all([
          nutritionistListService.getById(id as string),
          nutritionistListService.getPlans(id as string),
        ]);

        setProfile(profileRes);
        setPlans(plansRes?.data ?? []);
        setSelectedPlan(plansRes?.data?.[0] ?? null);

        const userId = getUserId();
        const role = getUserRole();

        if (role === "nutritionist" && userId === profileRes.id) {
          setIsOwnProfile(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  /* ─────────────────── LOADING ─────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent" />
          <p className="text-emerald-700 font-semibold text-sm tracking-wide">Loading plans…</p>
        </div>
      </div>
    );
  }

  /* ─────────────────── NOT FOUND ─────────────────── */
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <p className="text-red-500 font-semibold text-lg">Profile not found</p>
      </div>
    );
  }

  /* ─────────────────── PAGE ─────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 font-sans pb-36">

      {/* ── TOP HEADER ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-5 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="font-medium">Back to Profile</span>
          </button>

          {/* Title block */}
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent leading-tight mb-1">
            Choose Your Plan
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mb-4">
            Select a personalised nutrition programme designed for sustainable, lasting results.
          </p>

          <BreadcrumbHeader
            title=""
            crumbs={[
              { label: "Home", href: "/home" },
              { label: "Get a Coach", href: "/coaching" },
              { label: "Fitness & Nutrition", href: "#" },
              { label: profile.fullName, href: `/coaching/${id}` },
              { label: "Plans" },
            ]}
          />
        </div>
      </div>

      {/* ── PROFILE HERO CARD ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-sm opacity-30" />
              <img
                src={profile.profileImage || "/images/images.jpg"}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg object-cover"
                alt={profile.fullName}
              />
              {profile.nutritionistStatus === "TOP_COACH" && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5 shadow-md">
                  <Award className="text-white" size={14} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {/* Name + badge */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                  {profile.fullName}
                </h2>
                <span
                  className={`inline-flex items-center px-3 py-1 text-[10px] font-bold tracking-widest rounded-full ${
                    profile.nutritionistStatus === "TOP_COACH"
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {profile.nutritionistStatus === "TOP_COACH"
                    ? "⭐ TOP COACH"
                    : profile.nutritionistStatus}
                </span>
              </div>

              <p className="text-gray-400 text-sm font-medium mb-4">
                Certified Nutrition Coach
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <Users className="text-amber-500" size={15} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Clients</p>
                    <p className="text-sm font-bold text-gray-800">
                      {profile.totalPeopleCoached || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <TrendingUp className="text-purple-500" size={15} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Experience</p>
                    <p className="text-sm font-bold text-gray-800">
                      {profile.totalExperienceYears || 0} yrs
                    </p>
                  </div>
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
              <h2 className="text-xl font-bold text-gray-900">Available Plans</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Select the plan that best fits your goals and lifestyle
              </p>
            </div>

            {plans.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <Sparkles className="mx-auto text-gray-200 mb-3" size={40} />
                <p className="text-gray-400 text-sm font-medium">No plans available at the moment</p>
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
                        ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg"
                        : "border-gray-100 bg-white hover:border-emerald-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: title, meta, tags */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                            {plan.title}
                          </h3>
                          {index === 0 && (
                            <span className="flex-shrink-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                              POPULAR
                            </span>
                          )}
                        </div>

                        {/* Duration + category */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium mb-3">
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-emerald-500 flex-shrink-0" />
                            {plan.durationInDays} days
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={13} className="text-teal-500 flex-shrink-0" />
                            {plan.category}
                          </span>
                        </div>

                        {/* Tags */}
                        {plan.tags && plan.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {plan.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: price + radio */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                            Price
                          </p>
                          <div className="flex items-center justify-end text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            <IndianRupee
                              size={17}
                              className="text-emerald-600 flex-shrink-0"
                              strokeWidth={3}
                            />
                            {plan.price}
                          </div>
                        </div>

                        <div
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-gray-300 group-hover:border-emerald-300"
                          }`}
                        >
                          {isSelected && <CheckCircle className="text-white" size={16} />}
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
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 sticky top-24">
              {selectedPlan ? (
                <div className="space-y-6">
                  {/* Plan header */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug mb-1">
                      {selectedPlan.title}
                    </h3>
                    <p className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <Calendar size={14} className="text-emerald-500 flex-shrink-0" />
                      {selectedPlan.durationInDays}-day programme
                    </p>
                  </div>

                  {/* Price box */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">
                      Total Investment
                    </p>
                    <div className="flex items-end gap-1">
                      <IndianRupee
                        size={30}
                        className="text-emerald-600 mb-0.5 flex-shrink-0"
                        strokeWidth={3}
                      />
                      <span className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent leading-none">
                        {selectedPlan.price}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-600/70 mt-2 font-medium italic">
                      Approx{" "}
                      <strong>
                        ₹{(selectedPlan.price / selectedPlan.durationInDays).toFixed(0)}
                      </strong>{" "}
                      per day
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                      <Sparkles size={13} className="text-emerald-500" />
                      What's Included
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedPlan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 font-medium leading-snug">
                          <CheckCircle
                            className="text-emerald-500 flex-shrink-0 mt-0.5"
                            size={15}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags in detail panel */}
                  {selectedPlan.tags && selectedPlan.tags.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2.5">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlan.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pro tip */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      💡 <strong>Pro Tip:</strong> This plan focuses on sustainable results
                      with expert guidance throughout your journey.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                    <IndianRupee className="text-gray-200" size={32} />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">
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
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-2">
            How Our Programme Works
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            A simple, proven process to help you achieve your wellness goals.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connector line (desktop) */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-emerald-200 via-teal-200 to-cyan-200 -translate-x-1/2 hidden md:block" />

          <div className="space-y-10">
            {[
              {
                step: "01",
                icon: Sparkles,
                title: "Choose a Plan",
                desc: "Select a programme aligned with your fitness goals.",
                color: "from-emerald-500 to-teal-500",
              },
              {
                step: "02",
                icon: Users,
                title: "Get Your Coach",
                desc: "A professional nutritionist will guide and monitor your progress.",
                color: "from-teal-500 to-cyan-500",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Start Growing",
                desc: "Follow your plan with expert support and measurable results.",
                color: "from-cyan-500 to-blue-500",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`relative flex flex-col md:flex-row items-center gap-6 ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Card */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 w-full md:w-[45%] hover:shadow-md transition-shadow duration-300">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4 shadow-md`}
                  >
                    <item.icon size={20} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">
                    STEP {item.step}
                  </p>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>

                {/* Circle node on the line */}
                <div className="hidden md:flex w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 items-center justify-center text-white text-xs font-black shadow-lg ring-4 ring-white z-10 flex-shrink-0">
                  {item.step}
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STICKY CHECKOUT BAR ── */}
      {selectedPlan && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.07)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Selected plan summary */}
            <div className="text-center sm:text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                Selected Plan
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <p className="font-bold text-gray-900 text-base sm:text-lg leading-none">
                  {selectedPlan.title}
                </p>
                <span className="text-gray-200 select-none">|</span>
                <p className="font-black text-emerald-600 text-base sm:text-lg flex items-center leading-none">
                  <IndianRupee size={15} strokeWidth={3} className="flex-shrink-0" />
                  {selectedPlan.price}
                </p>
              </div>
            </div>

            {/* CTA */}
            {isOwnProfile ? (
              <button
                disabled
                className="w-full sm:w-auto bg-gray-100 text-gray-400 px-8 py-3.5 rounded-xl text-sm font-bold cursor-not-allowed select-none"
              >
                Own Profile — Cannot Select
              </button>
            ) : (
              <button
                onClick={() =>
                  router.push(`/coaching/${id}/checkout?planId=${selectedPlan.id}`)
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
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