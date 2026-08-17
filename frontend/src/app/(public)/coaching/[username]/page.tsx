"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CreditCard,
  Star,
  Award,
  Briefcase,
  Users,
  Activity,
  Calendar,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { nutritionistBrowsingService } from "@/services/user/nutriBrowsing.service";
import BreadcrumbHeader from "@/components/ui/nutritionists/BreadcrumbHeader";
import { NutritionistDetailDTO } from "@/dtos/user/nutri-browsing/nutri-detail.dto";

/** Converts snake_case enum values into readable Title Case labels. */
function formatLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function NutritionistProfilePage() {
  const { username } = useParams();
  const router = useRouter();

  const [data, setData] = useState<NutritionistDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const result = await nutritionistBrowsingService.getNutritionistProfile(
          username as string,
        );
        setData(result);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />
          <p className="text-slate-500 font-semibold text-sm tracking-wide">
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  /* ── NOT FOUND ── */
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
            <Star className="text-rose-500" size={28} />
          </div>
          <p className="text-rose-600 font-semibold text-lg">
            Nutritionist not found
          </p>
          <button
            onClick={() => router.back()}
            className="text-sm text-emerald-700 hover:underline font-semibold"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const { user, profile } = data;
  const firstName = user.fullName.split(" ")[0];
  const isTopCoach = profile.coachLevel === "top_coach";

  const stats = [
    {
      icon: Star,
      label: "Rating",
      value: `${profile.rating.toFixed(1)}/5`,
      badgeClass: "bg-amber-100/80 text-amber-700",
    },
    {
      icon: Users,
      label: "Clients",
      value: profile.totalPeopleCoached ?? 0,
      badgeClass: "bg-sky-100/80 text-sky-700",
    },
    {
      icon: Activity,
      label: "Experience",
      value: `${profile.totalExperienceYears ?? 0} yrs`,
      badgeClass: "bg-emerald-100/80 text-emerald-700",
    },
  ] as const;

  const renderStars = (rating: number, size = 14) =>
    [1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={
          s <= rating
            ? "text-amber-400 fill-amber-400"
            : "text-slate-200 fill-slate-100"
        }
      />
    ));

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* ── TOP HEADER ── */}
      <div className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700 transition-colors mb-4 group font-medium"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-200 flex-shrink-0"
            />
            Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1">
            Nutritionist Profile
          </h1>
          <BreadcrumbHeader
            title=""
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Get a Coach", href: "/coaching" },
              { label: "Nutritionists", href: "#" },
              { label: user.fullName },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── HERO CARD ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1 min-w-0">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full ring-4 ring-white shadow-lg overflow-hidden">
                  <Image
                    src={user.profileImage || "/images/images.jpg"}
                    alt={user.fullName}
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
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-snug truncate">
                    {user.fullName}
                  </h2>
                  <span
                    className={`flex-shrink-0 inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full border ${
                      isTopCoach
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {isTopCoach
                      ? "★ Top Coach"
                      : formatLabel(profile.coachLevel)}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-5">
                  Certified Nutrition Coach
                </p>
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

            {/* CTA */}
            <div className="w-full sm:w-auto flex-shrink-0">
              <Link
                href={`/coaching/${username}/plans`}
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-7 py-3.5 rounded-xl text-sm font-semibold shadow-xs hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 w-full sm:w-auto"
              >
                <CreditCard size={17} className="flex-shrink-0" />
                View Plans
              </Link>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-5 flex items-center gap-2.5">
                <div className="w-1 h-5 bg-emerald-600 rounded-full flex-shrink-0" />
                Professional Details
              </h3>

              <div className="space-y-6">
                {/* Experience */}
                {profile.experiences.length > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Briefcase
                        size={12}
                        className="text-emerald-600 flex-shrink-0"
                      />
                      Experience
                    </p>
                    <div className="space-y-2">
                      {profile.experiences.map((exp, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-sm font-semibold text-slate-900 leading-snug">
                            {exp.role}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {exp.organization} · {exp.durationYears}{" "}
                            {exp.durationYears === 1 ? "yr" : "yrs"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Qualifications */}
                {profile.qualifications.length > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Award
                        size={12}
                        className="text-emerald-600 flex-shrink-0"
                      />
                      Qualifications
                    </p>
                    <div className="space-y-2">
                      {profile.qualifications.map((q, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-sm font-semibold text-slate-900 leading-snug">
                            {q.degree}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {q.institution} · {q.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {profile.certifications.length > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <ShieldCheck
                        size={12}
                        className="text-sky-600 flex-shrink-0"
                      />
                      Certifications
                    </p>
                    <div className="space-y-2">
                      {profile.certifications.map((c, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-sm font-semibold text-slate-900 leading-snug">
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Issued by {c.issuedBy}
                          </p>
                          {c.certificateUrl && (
                            <Link
                              href={c.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-block text-xs font-semibold text-emerald-700 hover:underline"
                            >
                              View certificate →
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specializations */}
                {profile.specializations.length > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2.5">
                      Specializations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.specializations.map((s) => (
                        <span
                          key={s}
                          className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-lg text-xs font-semibold"
                        >
                          {formatLabel(s)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {profile.languages.length > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2.5">
                      Languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((l) => (
                        <span
                          key={l}
                          className="bg-slate-50 border border-slate-200/80 text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold"
                        >
                          {formatLabel(l)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-emerald-700 rounded-2xl p-6 text-white shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wider">
                <TrendingUp size={16} className="flex-shrink-0" />
                Success Highlights
              </h3>
              <div className="space-y-3">
                {[
                  `${profile.totalPeopleCoached ?? 0}+ clients transformed`,
                  `${profile.totalExperienceYears ?? 0} years of expertise`,
                  `${profile.rating.toFixed(1)}/5 average rating`,
                ].map((line) => (
                  <div key={line} className="flex items-start gap-2.5">
                    <CheckCircle
                      size={14}
                      className="flex-shrink-0 mt-0.5 text-white/80"
                    />
                    <span className="text-sm font-medium leading-snug">
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-200/80 bg-slate-50">
                {(["about", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                      activeTab === tab
                        ? "bg-white border-b-2 border-emerald-600 text-emerald-700"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab === "about" ? (
                      "About Me"
                    ) : (
                      <span className="inline-flex items-center justify-center gap-2">
                        Reviews
                        {profile.totalReviews > 0 && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              activeTab === "reviews"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {profile.totalReviews}
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8">
                {/* ── ABOUT ── */}
                {activeTab === "about" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                        <div className="w-1 h-7 bg-emerald-600 rounded-full flex-shrink-0" />
                        About {firstName}
                      </h3>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {profile.bio ||
                          "No bio available yet. This nutritionist is building their profile."}
                      </p>
                    </div>
                    {profile.bio && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                        <h4 className="font-bold text-emerald-900 text-sm mb-1.5 flex items-center gap-2">
                          <Calendar
                            size={15}
                            className="flex-shrink-0 text-emerald-700"
                          />
                          Ready to start your journey?
                        </h4>
                        <p className="text-emerald-800/80 text-xs leading-relaxed mb-4">
                          Book a consultation with {firstName} and get
                          personalised nutrition guidance tailored to your
                          goals.
                        </p>
                        <Link
                          href={`/coaching/${username}/plans`}
                          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition-colors"
                        >
                          <CreditCard size={15} className="flex-shrink-0" />
                          View Available Plans
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* ── REVIEWS ── */}
                {activeTab === "reviews" && (
                  <div className="space-y-5">
                    {profile.totalReviews > 0 ? (
                      <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div className="text-center flex-shrink-0">
                          <p className="text-4xl font-black text-slate-900 leading-none">
                            {profile.rating.toFixed(1)}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                            out of 5
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-2">
                            {renderStars(Math.round(profile.rating), 18)}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {profile.totalReviews} review
                            {profile.totalReviews !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 border border-dashed border-slate-300 rounded-xl">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4">
                          <Star className="text-emerald-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                          No Reviews Yet
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                          {firstName} is building their reputation. Be the first
                          to work with them and leave a review!
                        </p>
                      </div>
                    )}
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
