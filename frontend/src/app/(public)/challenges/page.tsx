import { ChallengeHero } from "@/components/public/challenge/challengeHero";
import { ChallengeListing } from "@/components/public/challenge/ChallengeListing";

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <ChallengeHero />
        </div>
      </div>

      <section className="px-4 pb-8 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
        </div>
      </section>

      <ChallengeListing />
    </div>
  );
}
