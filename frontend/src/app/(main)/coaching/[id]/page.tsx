"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Star,
  MapPin,
  Award,
  Users,
  Activity,
  Calendar,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { nutritionistListService } from "@/services/user/nutritionistList.service";
import BreadcrumbHeader from "@/components/ui/nutritionists/BreadcrumbHeader";
import { NutritionistProfileDTO } from "@/constants/nutritionist/nutritionistProfile.constants";

export default function NutritionistProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<NutritionistProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await nutritionistListService.getById(id as string);
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent" />
          <p className="text-emerald-700 font-semibold text-sm tracking-wide">
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  /* ── NOT FOUND ── */
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <Star className="text-red-400" size={30} />
          </div>
          <p className="text-red-500 font-semibold text-lg">Nutritionist not found</p>
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

  const firstName = profile.fullName.split(" ")[0];

  const stats = [
    {
      icon: Star,
      label: "Rating",
      value: `${profile.rating?.toFixed(1) ?? 0}/5`,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: Users,
      label: "Clients",
      value: profile.totalPeopleCoached ?? 0,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Activity,
      label: "Experience",
      value: `${profile.totalExperienceYears ?? 0} yrs`,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-20 font-sans">

      {/* ── TOP HEADER ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-4 group font-medium"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-200 flex-shrink-0"
            />
            Back
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent leading-tight mb-1">
            Nutritionist Profile
          </h1>
          <BreadcrumbHeader
            title=""
            crumbs={[
              { label: "Home", href: "/home" },
              { label: "Get a Coach", href: "/coaching" },
              { label: "Nutritionists", href: "#" },
              { label: profile.fullName },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── HERO CARD ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" />
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

              {/* Avatar + info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1 min-w-0">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-sm opacity-30" />
                  <img
                    src={profile.profileImage || "/images/images.jpg"}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-white shadow-xl object-cover"
                    alt={profile.fullName}
                  />
                  {profile.nutritionistStatus === "TOP_COACH" && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5 shadow-md">
                      <Award className="text-white" size={15} />
                    </div>
                  )}
                </div>

                {/* Name + stats */}
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug truncate">
                      {profile.fullName}
                    </h2>
                    <span
                      className={`flex-shrink-0 inline-flex items-center px-3 py-1 text-[10px] font-black tracking-widest rounded-full ${
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

                  <p className="text-gray-400 text-sm font-medium mb-5">
                    Certified Nutrition Coach
                  </p>

                  {/* Stats row */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    {stats.map((s) => (
                      <div key={s.label} className="flex items-center gap-2">
                        <div className={`${s.bg} p-2 rounded-lg flex-shrink-0`}>
                          <s.icon className={s.color} size={15} />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                            {s.label}
                          </p>
                          <p className="text-sm font-bold text-gray-900">{s.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="w-full sm:w-auto flex-shrink-0">
                <Link
                  href={`/coaching/${id}/plans`}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-7 py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-emerald-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
                >
                  <CreditCard size={17} className="flex-shrink-0" />
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ── LEFT SIDEBAR ── */}
          <div className="lg:col-span-4 space-y-5">

            {/* Professional Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-extrabold text-gray-900 mb-5 flex items-center gap-2.5">
                <div className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full flex-shrink-0" />
                Professional Details
              </h3>

              <div className="space-y-3">
                {/* Location */}
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
                  <MapPin className="text-emerald-500 flex-shrink-0 mt-0.5" size={17} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {profile.country}
                    </p>
                  </div>
                </div>

                {/* Qualifications */}
                {profile.qualifications.length > 0 && (
                  <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
                    <Award className="text-teal-500 flex-shrink-0 mt-0.5" size={17} />
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                        Qualifications
                      </p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">
                        {profile.qualifications.join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Specializations */}
                {profile.specializations.length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-2.5">
                      Specializations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.specializations.map((s) => (
                        <span
                          key={s}
                          className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Success Highlights */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-sm">
              <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2 uppercase tracking-wide">
                <TrendingUp size={16} className="flex-shrink-0" />
                Success Highlights
              </h3>
              <div className="space-y-3">
                {[
                  `${profile.totalPeopleCoached ?? 0}+ clients transformed`,
                  `${profile.totalExperienceYears ?? 0} years of expertise`,
                  `${profile.rating?.toFixed(1) ?? 0}/5 average rating`,
                ].map((line) => (
                  <div key={line} className="flex items-start gap-2.5">
                    <CheckCircle size={14} className="flex-shrink-0 mt-0.5 text-white/80" />
                    <span className="text-sm font-medium leading-snug">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT CONTENT AREA ── */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Tabs */}
              <div className="flex border-b border-gray-100 bg-gray-50">
                {(["about", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3.5 text-sm font-bold transition-all capitalize ${
                      activeTab === tab
                        ? "bg-white border-b-2 border-emerald-500 text-emerald-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab === "about" ? "About Me" : "Reviews"}
                  </button>
                ))}
              </div>

              {/* Tab body */}
              <div className="p-6 sm:p-8">
                {activeTab === "about" ? (
                  <div className="space-y-6">
                    {/* About section */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                        <div className="w-1 h-7 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full flex-shrink-0" />
                        About {firstName}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {profile.bio ||
                          "No bio available yet. This nutritionist is building their profile."}
                      </p>
                    </div>

                    {/* CTA block */}
                    {profile.bio && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mt-2">
                        <h4 className="font-bold text-emerald-900 text-sm mb-1.5 flex items-center gap-2">
                          <Calendar size={15} className="flex-shrink-0 text-emerald-600" />
                          Ready to start your journey?
                        </h4>
                        <p className="text-emerald-800/80 text-xs leading-relaxed mb-4">
                          Book a consultation with {firstName} and get personalised nutrition
                          guidance tailored to your goals.
                        </p>
                        <Link
                          href={`/coaching/${id}/plans`}
                          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors"
                        >
                          <CreditCard size={15} className="flex-shrink-0" />
                          View Available Plans
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Reviews empty state */
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                      <Star className="text-gray-200" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1.5">No Reviews Yet</h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                      {firstName} is building their reputation. Be the first to work with them
                      and leave a review!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}