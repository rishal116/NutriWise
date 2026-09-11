import ChallengeForm from "@/components/admin/challenge/ChallengeForm";

export default function CreateChallengePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Challenge
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a new health and wellness challenge for NutriWise users.
        </p>
      </div>

      <ChallengeForm mode="create" />
    </div>
  );
}