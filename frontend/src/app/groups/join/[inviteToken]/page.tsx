"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Loader2, Lock, Users } from "lucide-react";

import { groupService } from "@/services/group/group.service";

export default function JoinGroupPage() {
  const params = useParams();
  const router = useRouter();

  const inviteToken = params.inviteToken as string;

  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinGroup = async () => {
    if (!inviteToken) {
      setError("Invalid invite link.");
      return;
    }

    try {
      setJoining(true);
      setError(null);

      const result = await groupService.joinGroup(inviteToken);

      router.replace(`/messages/groups/${result.groupId}`);
    } catch {
      setError(
        "This invite link is invalid, expired, or the group is no longer available.",
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-emerald-50 px-6 py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
            <Lock size={22} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Private Group Invitation
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You have been invited to join a private NutriWise group.
          </p>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500">
              <Users size={18} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Group
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-800">
                Private nutrition group
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
              <p className="text-sm font-medium leading-6 text-rose-600">
                {error}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleJoinGroup}
            disabled={joining}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {joining ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Joining group...
              </>
            ) : (
              "Join Group"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}