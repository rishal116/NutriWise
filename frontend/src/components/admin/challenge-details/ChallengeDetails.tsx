"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import type { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";
import { adminChallengeService } from "@/services/admin/admin-challenge.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { ChallengeDetailsHeader } from "./ChallengeDetailsHeader";
import { ChallengeOverview } from "./ChallengeOverview";
import { ChallengeMetadata } from "./ChallengeMetadata";
import { ChallengeDetailsSkeleton } from "./ChallengeDetailsSkeleton";

interface ChallengeDetailsProps {
  challengeId: string;
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

function SectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-72 animate-pulse rounded-2xl border border-admin-border bg-admin-surface"
    />
  );
}

// Below-the-fold section: its code is a separate chunk.
const ChallengeDaysSection = dynamic(
  () =>
    import("./ChallengeDaysSection").then(
      (module) => module.ChallengeDaysSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

// Renders children only once the placeholder is within 300px of the viewport.
function RenderWhenVisible({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [visible]);

  return <div ref={ref}>{visible ? children : fallback}</div>;
}

export default function ChallengeDetails({
  challengeId,
}: ChallengeDetailsProps) {
  const router = useRouter();

  const [challenge, setChallenge] =
    useState<AdminChallengeDetailsDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchChallenge = useCallback(
    async (signal: { cancelled: boolean }) => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await adminChallengeService.getChallengeDetails(challengeId);

        if (signal.cancelled) return;

        if (!response.success || !response.data) {
          setChallenge(null);
          setError(response.message || "Failed to load challenge details.");
          return;
        }

        const loadedChallenge = response.data;

        setChallenge(loadedChallenge);

        sessionStorage.setItem(
          `challenge-duration-${loadedChallenge.id}`,
          String(loadedChallenge.durationDays),
        );
      } catch (err: unknown) {
        if (signal.cancelled) return;

        console.error("Failed to fetch challenge details:", err);

        setChallenge(null);
        setError(getErrorMessage(err));
      } finally {
        if (!signal.cancelled) {
          setLoading(false);
        }
      }
    },
    [challengeId],
  );

  useEffect(() => {
    const signal = { cancelled: false };

    void fetchChallenge(signal);

    return () => {
      signal.cancelled = true;
    };
  }, [fetchChallenge, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const handlePublish = async () => {
    try {
      setActionLoading(true);

      const response =
        await adminChallengeService.publishChallenge(challengeId);

      if (!response.success) {
        toast.error(response.message || "Failed to publish challenge.");
        return;
      }

      setChallenge((prev) =>
        prev ? { ...prev, status: "published" } : prev,
      );

      toast.success("Challenge published successfully.");
    } catch (err: unknown) {
      console.error("Failed to publish challenge:", err);
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this challenge?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response =
        await adminChallengeService.deleteChallenge(challengeId);

      if (!response.success) {
        toast.error(response.message || "Failed to delete challenge.");
        return;
      }

      toast.success("Challenge deleted successfully.");

      router.push("/admin/challenges");
      router.refresh();
    } catch (err: unknown) {
      console.error("Failed to delete challenge:", err);
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <ChallengeDetailsSkeleton />;
  }

  if (!challenge) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-admin-border bg-admin-surface p-8 text-center shadow-sm shadow-admin-text/5 sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-admin-surface-hover text-admin-muted">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-admin-text">
            Unable to load challenge
          </h2>

          <p className="mt-2 text-sm leading-6 text-admin-muted">
            {error || "The challenge may have been deleted or no longer exists."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className={`inline-flex items-center gap-2 rounded-xl border border-admin-border px-4 py-2.5 text-sm font-semibold text-admin-text transition-colors hover:bg-admin-surface-hover ${FOCUS_RING}`}
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>

            <Link
              href="/admin/challenges"
              className={`inline-flex items-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-sm font-semibold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover ${FOCUS_RING}`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <ChallengeDetailsHeader
        challenge={challenge}
        actionLoading={actionLoading}
        onPublish={handlePublish}
        onDelete={handleDelete}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <ChallengeOverview challenge={challenge} />

          {challenge.instructions && (
            <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm shadow-admin-text/5 sm:p-6">
              <h2 className="text-lg font-semibold text-admin-text">
                Instructions
              </h2>

              <p className="mt-1 text-sm text-admin-muted">
                Guidance for participants completing this challenge.
              </p>

              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-admin-text/80">
                {challenge.instructions}
              </p>
            </section>
          )}

          <RenderWhenVisible fallback={<SectionSkeleton />}>
            <ChallengeDaysSection challengeId={challenge.id} />
          </RenderWhenVisible>
        </div>

        <ChallengeMetadata challenge={challenge} />
      </div>
    </div>
  );
}