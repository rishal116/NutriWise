"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { adminChallengeService } from "@/services/admin/adminChallenge.service";
import { Challenge } from "@/types/challenge";
import {
  BadgeCheck,
  Clock,
  Star,
  TrendingUp,
  Lock,
  Globe,
  Dumbbell,
  Tag,
  Loader2,
  ArrowLeft,
  Pencil,
  Trash2,
  Flame,
  LayoutGrid,
  Zap,
  Search,
  ImageIcon,
  Video,
  ImageIcon as _ImagePlaceholder,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";





interface Props {
  id: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────────────────────────────────────
type IconColor = "teal" | "amber" | "blue" | "purple";

const ICON_COLOR_MAP: Record<IconColor, { wrapper: string; icon: string }> = {
  teal: { wrapper: "bg-teal-50", icon: "text-teal-700" },
  amber: { wrapper: "bg-amber-50", icon: "text-amber-700" },
  blue: { wrapper: "bg-blue-50", icon: "text-blue-700" },
  purple: { wrapper: "bg-purple-50", icon: "text-purple-700" },
};

function StatCard({
  icon,
  label,
  value,
  color = "teal",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: IconColor;
}) {
  const c = ICON_COLOR_MAP[color];
  return (
    <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-2.5 border border-slate-100">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.wrapper}`}
      >
        <span className={`[&>svg]:w-3.5 [&>svg]:h-3.5 ${c.icon}`}>{icon}</span>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-[15px] font-bold text-slate-800 leading-tight">
        {value}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section card
// ─────────────────────────────────────────────────────────────────────────────
function SectionCard({
  icon,
  title,
  color = "teal",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color?: IconColor;
  children: React.ReactNode;
}) {
  const c = ICON_COLOR_MAP[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center ${c.wrapper}`}
        >
          <span className={`[&>svg]:w-4 [&>svg]:h-4 ${c.icon}`}>{icon}</span>
        </div>
        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Status / difficulty / type badge colors
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({
  value,
  type,
}: {
  value: string;
  type: "status" | "difficulty" | "type" | "category" | "custom";
}) {
  const styles: Record<string, string> = {
    active: "bg-teal-100 text-teal-700 border-teal-200",
    published: "bg-teal-100 text-teal-700 border-teal-200",
    inactive: "bg-slate-100 text-slate-500 border-slate-200",
    archived: "bg-slate-100 text-slate-500 border-slate-200",
    draft: "bg-amber-100 text-amber-700 border-amber-200",
    beginner: "bg-green-100 text-green-700 border-green-200",
    easy: "bg-green-100 text-green-700 border-green-200",
    intermediate: "bg-amber-100 text-amber-700 border-amber-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    advanced: "bg-red-100 text-red-600 border-red-200",
    hard: "bg-red-100 text-red-600 border-red-200",
    fitness: "bg-blue-100 text-blue-700 border-blue-200",
    nutrition: "bg-emerald-100 text-emerald-700 border-emerald-200",
    mental: "bg-violet-100 text-violet-700 border-violet-200",
    hybrid: "bg-teal-100 text-teal-700 border-teal-200",
    productivity: "bg-amber-100 text-amber-700 border-amber-200",
    recovery: "bg-rose-100 text-rose-700 border-rose-200",
  };


  const typePrefix = {
    status: "",
    difficulty: "Diff: ",
    type: "Type: ",
    category: "Cat: ",
    custom: "Custom: ",
  }[type];

  const fallback = "bg-slate-100 text-slate-500 border-slate-200";
  const cls = styles[value?.toLowerCase()] ?? fallback;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}
    >
      {typePrefix}
      {value}
    </span>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminChallengeDetails({ id }: Props) {
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    if (!challenge) return;
    try {
      setPublishing(true);
      await adminChallengeService.publishChallenge(id);
      setChallenge({ ...challenge, status: "published" });
      toast.success("Challenge published successfully!");
    } catch (error) {
      console.error("Failed to publish challenge:", error);
      toast.error("Failed to publish challenge.");
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await adminChallengeService.getChallengeById(id);
        setChallenge(res.data);
      } catch (error) {
        console.error("Failed to fetch challenge:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <p className="text-sm font-medium">Challenge not found</p>
        <button
          onClick={() => router.back()}
          className="text-xs text-teal-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Breadcrumb + actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors w-fit"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to challenges
        </button>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors"
            onClick={() => router.push(`/admin/challenges/${id}/tasks`)}
          >
            <Dumbbell size={13} strokeWidth={2} />
            Tasks
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-teal-700 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 transition-colors"
            onClick={() => router.push(`/admin/challenges/${id}/edit`)}
          >
            <Pencil size={13} strokeWidth={2} />
            Edit
          </button>
          {challenge.status !== "published" && (
            <button
              disabled={publishing}
              onClick={handlePublish}
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-white bg-emerald-600 border border-emerald-500 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 active:scale-95"
            >
              {publishing ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Rocket size={13} strokeWidth={2.5} />
              )}
              {publishing ? "Publishing..." : "Publish Now"}
            </button>
          )}
        </div>
      </div>

      {/* ── Hero card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Banner */}
        <div className="relative w-full h-64 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-400">
          {challenge.bannerImage && challenge.bannerImage.trim() !== "" ? (
            <Image
              src={challenge.bannerImage}
              alt={challenge.title}
              fill
              unoptimized
              className="object-cover"
            />

          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={48} className="text-white/20" />
            </div>
          )}
          {/* Overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges — top-left */}
          <div className="absolute top-6 left-6 flex items-center gap-2 flex-wrap max-w-[80%]">
            <StatusBadge value={challenge.status} type="status" />
            <StatusBadge value={challenge.difficulty} type="difficulty" />
            <StatusBadge value={challenge.type} type="type" />
            {challenge.category && (
              <StatusBadge value={challenge.category} type="category" />
            )}
            {challenge.customCategory && (
              <StatusBadge value={challenge.customCategory} type="custom" />
            )}
          </div>

          {/* Premium pill — top-right */}
          {challenge.isPremium && (
            <div className="absolute top-6 right-6">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500 text-white border border-purple-400 shadow-lg shadow-purple-500/20">
                <Lock size={10} strokeWidth={3} />
                Premium
              </span>
            </div>
          )}

          {/* Cover Image Overlapping */}
          <div className="absolute -bottom-10 left-8">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">
              {challenge.coverImage && challenge.coverImage.trim() !== "" ? (
                <Image
                  src={challenge.coverImage}
                  alt="Cover"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={24} className="text-slate-300" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Header Content (White Area) */}
        <div className="pt-12 pb-6 px-8 ml-40">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {challenge.title}
          </h1>
          <p className="text-black font-medium text-[14px] mt-1.5 max-w-2xl">
            {challenge.shortDescription}
          </p>

        </div>



        {/* Stats row */}
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard
              icon={<Clock />}
              label="Duration"
              value={`${challenge.duration} days`}
              color="teal"
            />
            <StatCard
              icon={<Star />}
              label="Rating"
              value={`${challenge.averageRating} / 5 (${challenge.totalReviews} reviews)`}
              color="amber"
            />

            <StatCard
              icon={<TrendingUp />}
              label="Enrollments"
              value={`${challenge.totalEnrollments.toLocaleString()}`}
              color="blue"
            />
            <StatCard
              icon={<Flame />}
              label="Est. Burn"
              value={challenge.estimatedCaloriesBurn ? `${challenge.estimatedCaloriesBurn} kcal` : "N/A"}
              color="amber"
            />

            <StatCard
              icon={challenge.isPremium ? <Lock /> : <Globe />}
              label="Access"
              value={challenge.isPremium ? "Premium" : "Free"}
              color="purple"
            />
          </div>
        </div>

      </div>

      {/* ── Description ── */}
      <SectionCard icon={<BadgeCheck />} title="Description" color="blue">
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {challenge.description}
        </p>
      </SectionCard>

      {/* ── Benefits + Equipment ── */}
      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard icon={<BadgeCheck />} title="Benefits" color="teal">
          <ul className="space-y-1.5">
            {challenge.benefits.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[13px] text-slate-600"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard icon={<Dumbbell />} title="Equipment needed" color="amber">
          <ul className="space-y-1.5">
            {challenge.equipmentNeeded.map((e, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[13px] text-slate-600"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                {e}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* ── Tags ── */}
      <SectionCard icon={<Tag />} title="Tags" color="purple">
        <div className="flex flex-wrap gap-2">
          {challenge.tags && challenge.tags.length > 0 ? (
            challenge.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 transition-colors cursor-default"
              >
                # {tag}
              </span>
            ))
          ) : (
            <p className="text-[11px] text-slate-400">No tags added</p>
          )}
        </div>
      </SectionCard>

      {/* ── Intro Video ── */}
      {challenge.introVideo && (
        <SectionCard icon={<Video />} title="Intro Video" color="purple">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
            <video
              src={challenge.introVideo}
              controls
              className="w-full h-full object-contain"
            />
          </div>
        </SectionCard>
      )}

      {/* ── Media Gallery ── */}
      {challenge.media && challenge.media.length > 0 && (
        <SectionCard icon={<LayoutGrid />} title="Media Gallery" color="blue">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {challenge.media.map((m, i) => (
              <div
                key={i}
                className="group relative aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50"
              >
                {m.type === "image" && m.url && m.url.trim() !== "" ? (
                  <Image
                    src={m.url}
                    alt={m.title || `Gallery ${i}`}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                ) : m.type === "image" ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <ImageIcon size={20} className="text-slate-200" />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <Video size={24} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Video
                    </span>
                  </div>
                )}

                {m.title && (
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold text-white truncate">
                      {m.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Advanced & SEO ── */}
      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard icon={<Zap />} title="Promotional Flags" color="amber">
          <div className="space-y-3">
            {[
              { label: "Featured", value: challenge.isFeatured },
              { label: "Trending", value: challenge.isTrending },
              { label: "Recommended", value: challenge.isRecommended },
            ].map((flag) => (
              <div key={flag.label} className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-600">
                  {flag.label}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${flag.value
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                    }`}
                >
                  {flag.value ? "Yes" : "No"}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon={<Search />} title="SEO Metadata" color="blue">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                SEO Title
              </p>
              <p className="text-[12px] text-slate-700 font-medium">
                {challenge.seoTitle || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                SEO Description
              </p>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                {challenge.seoDescription || "Not set"}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

    </div>
  );
}
