import dynamic from "next/dynamic";
import { ChallengeHero } from "@/components/public/challenge/challengeHero";

const ChallengeListing = dynamic(
  () =>
    import("@/components/public/challenge/ChallengeListing").then(
      (m) => m.ChallengeListing,
    ),
  {
    loading: () => (
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl bg-[#ECFDF5]"
            />
          ))}
        </div>
      </div>
    ),
  },
);

export default function ChallengesPage() {
  return (
    <div className="min-h-screen">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <ChallengeHero />
        </div>
      </div>
      <div className="pt-6 sm:pt-8">
        <ChallengeListing />
      </div>
    </div>
  );
}
