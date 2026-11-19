"use client"
import dynamic from "next/dynamic";

import HeroSection from "./sections/HeroSection";
import FinalCTASection from "./sections/FinalCTASection";

const SectionFallback = () => (
  <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
    <div className="mb-8 h-8 w-64 animate-pulse rounded-lg bg-slate-100" />
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-64 animate-pulse rounded-2xl bg-slate-100"
        />
      ))}
    </div>
  </div>
);

const FeaturedNutritionists = dynamic(
  () => import("./sections/FeaturedNutritionists"),
  { loading: () => <SectionFallback /> },
);

const PopularChallenges = dynamic(
  () => import("./sections/PopularChallenges"),
  { loading: () => <SectionFallback /> },
);

const CommunityGroups = dynamic(
  () => import("./sections/CommunityGroups"),
  { loading: () => <SectionFallback /> },
);

const UpcomingSessions = dynamic(
  () => import("./sections/UpcomingSessions"),
  { loading: () => <SectionFallback /> },
);

const LatestPosts = dynamic(
  () => import("./sections/LatestPosts"),
  { loading: () => <SectionFallback /> },
);

const EducationalResources = dynamic(
  () => import("./sections/EducationalResources"),
  { loading: () => <SectionFallback /> },
);

const Testimonials = dynamic(
  () => import("./sections/Testimonials"),
  { loading: () => <SectionFallback /> },
);

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <HeroSection />

      <div className="bg-white">
        <FeaturedNutritionists />
        <PopularChallenges />
      </div>

      <div className="bg-slate-50/70">
        <CommunityGroups />
        <UpcomingSessions />
      </div>

      <div className="bg-white">
        <LatestPosts />
        <EducationalResources />
      </div>

      <div className="bg-emerald-50/40">
        <Testimonials />
      </div>

      <FinalCTASection />
    </main>
  );
}
