"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Loader2,
  ShieldCheck,
  Users,
  AlertCircle,
} from "lucide-react";

import { groupService } from "@/services/chat/group.service";

export default function JoinGroupPage() {
  const params = useParams<{ inviteToken: string }>();
  const router = useRouter();

  const inviteToken = params.inviteToken;

  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinGroup = async () => {
    if (!inviteToken?.trim()) {
      setError("This invitation link is invalid.");
      return;
    }

    try {
      setJoining(true);
      setError(null);

      const response = await groupService.joinPrivateGroup(inviteToken);
      const { groupId } = response.data;

      router.replace(`/user/messages/group/${groupId}`);
    } catch {
      setError(
        "We couldn't join this group. The invitation may be invalid, expired, or the group may no longer be available. Please check the link and try again.",
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100dvh-5rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />
      </div>

      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
        <div className="px-6 pb-7 pt-9 text-center sm:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <LockKeyhole size={27} strokeWidth={1.8} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            NutriWise Community
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            You&apos;re invited!
          </h1>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
            Join a private nutrition group to connect, share knowledge, and
            support each other on your wellness journey.
          </p>
        </div>

        <div className="px-6 pb-7 sm:px-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200/70">
                <Users size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-slate-900">
                  Private nutrition group
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Invitation-only community
                </p>
              </div>

              <LockKeyhole
                size={16}
                className="shrink-0 text-slate-400"
                aria-label="Private group"
              />
            </div>

            <div className="my-4 border-t border-slate-200" />

            <div className="flex items-start gap-2.5">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-emerald-700"
              />
              <p className="text-xs leading-5 text-slate-600">
                Only invited members can access this group. Your membership will
                be verified securely.
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-rose-600"
              />
              <p className="text-sm leading-6 text-rose-700">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleJoinGroup}
            disabled={joining}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {joining ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Joining group...
              </>
            ) : (
              <>
                Join private group
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            By joining, you agree to participate respectfully and follow the
            community guidelines.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span className="text-xs font-medium text-slate-500">
            A community built around healthier living
          </span>
        </div>
      </section>
    </main>
  );
}
