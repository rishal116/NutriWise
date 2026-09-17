"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowLeft, Check, Globe2, Loader2, Users } from "lucide-react";

import { publicGroupService } from "@/services/public/publicGroup.service";

import type { PublicGroupDetailsDTO } from "@/dtos/public/group/public-group-details.dto";

import { getErrorMessage } from "@/utils/getErrorMessage";

interface GroupDetailsPageProps {
  params: Promise<{
    groupId: string;
  }>;
}

function getInitial(title: string): string {
  return title.trim().charAt(0).toUpperCase() || "G";
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function GroupDetailsPage({ params }: GroupDetailsPageProps) {
  const [group, setGroup] = useState<PublicGroupDetailsDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        setError(null);

        const { groupId } = await params;

        const response = await publicGroupService.getGroupDetails(groupId);

        setGroup(response.data);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [params]);

  const handleJoinGroup = async () => {
    if (!group || joining || joined) {
      return;
    }

    try {
      setJoining(true);
      setJoinError(null);

      const response = await publicGroupService.joinGroup(group.id);

      setGroup(response.data);
      setJoined(true);
    } catch (error) {
      setJoinError(getErrorMessage(error));
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-72 animate-pulse bg-slate-200 sm:h-96" />

            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_300px]">
              <div className="space-y-4">
                <div className="h-8 w-2/3 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="space-y-3">
                <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
                <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !group) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/groups"
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to groups
          </Link>

          <div className="mt-6 rounded-3xl border border-rose-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <Globe2 size={24} />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Group not found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error || "This public group is no longer available."}
            </p>

            <Link
              href="/groups"
              className="mt-6 inline-flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Browse groups
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          href="/groups"
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600"
        >
          <ArrowLeft
            size={15}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to groups
        </Link>

        {/* Main card */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_-20px_rgba(15,23,42,0.25)]">
          {/* Hero */}
          <div className="relative h-72 overflow-hidden bg-emerald-50 sm:h-96">
            {group.groupAvatar ? (
              <>
                <Image
                  src={group.groupAvatar}
                  alt={group.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-emerald-600 text-5xl font-bold text-white shadow-xl shadow-emerald-200">
                  {getInitial(group.title)}
                </div>
              </div>
            )}

            {/* Hero content */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-700 shadow-sm backdrop-blur">
                  <Globe2 size={11} />
                  Public group
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/45 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                  <Users size={11} />
                  {group.memberCount}{" "}
                  {group.memberCount === 1 ? "member" : "members"}
                </span>
              </div>

              <h1 className="mt-3 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-4xl">
                {group.title}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="grid gap-10 p-6 md:p-8 lg:grid-cols-[1fr_300px]">
            {/* Main content */}
            <div className="min-w-0">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600">
                  About the community
                </p>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {group.description ||
                    "No description has been added to this group yet."}
                </p>
              </div>

              <div className="mt-9 border-t border-slate-100 pt-8">
                <h2 className="text-lg font-bold text-slate-900">
                  Connect with the community
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                  Join this public NutriWise group to take part in
                  conversations, share experiences, and connect with people
                  interested in health and wellness.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:border-l lg:border-slate-100 lg:pl-7">
              <div className="space-y-3 lg:sticky lg:top-6">
                {/* Members */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Users size={18} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Community
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {group.memberCount}
                      </p>

                      <p className="text-xs text-slate-500">
                        {group.memberCount === 1 ? "member" : "members"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Join */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Ready to join?
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    Become part of this public community.
                  </p>

                  <button
                    type="button"
                    onClick={handleJoinGroup}
                    disabled={joining || joined}
                    className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                      joined
                        ? "cursor-default bg-emerald-100 text-emerald-700"
                        : "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    }`}
                  >
                    {joining ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Joining...
                      </>
                    ) : joined ? (
                      <>
                        <Check size={16} />
                        Joined
                      </>
                    ) : (
                      "Join Group"
                    )}
                  </button>

                  {joinError && (
                    <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-600">
                      {joinError}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {formatDate(group.createdAt)}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Last updated
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {formatDate(group.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
