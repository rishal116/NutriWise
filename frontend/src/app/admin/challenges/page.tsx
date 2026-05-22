"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Rocket,
  Trophy,
  Search,
  X,
  CheckCircle2,
  FileText,
  Archive,
  Loader2,
} from "lucide-react";
import { adminChallengeService } from "@/services/admin/adminChallenge.service";
import { toast } from "sonner";
import {
  ChallengeListItem,
  ChallengeStatus,
  ChallengeType,
  ChallengeDifficulty,
  ChallengeVisibility,
  ChallengeSortBy,
} from "@/types/challenge";
import { useDebounce } from "@/hooks/admin/debounce.hooks";

// ── Constants ──────────────────────────────────────────────────────────────────

const LIMIT = 10;

const STATUS_CONFIG: Record<
  ChallengeStatus,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  published: {
    bg: "bg-teal-50 border-teal-100",
    text: "text-teal-700",
    icon: <CheckCircle2 size={11} strokeWidth={2.5} />,
  },
  draft: {
    bg: "bg-amber-50 border-amber-100",
    text: "text-amber-700",
    icon: <FileText size={11} strokeWidth={2.5} />,
  },
  archived: {
    bg: "bg-slate-100 border-slate-200",
    text: "text-slate-500",
    icon: <Archive size={11} strokeWidth={2.5} />,
  },
};

const DIFFICULTY_CONFIG: Record<ChallengeDifficulty, string> = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  hard: "bg-red-50 text-red-600 border-red-100",
};

const TYPE_CONFIG: Record<ChallengeType, string> = {
  fitness: "bg-blue-50 text-blue-700 border-blue-100",
  nutrition: "bg-emerald-50 text-emerald-700 border-emerald-100",
  mental: "bg-violet-50 text-violet-700 border-violet-100",
  hybrid: "bg-teal-50 text-teal-700 border-teal-100",
  productivity: "bg-amber-50 text-amber-700 border-amber-100",
};

const SELECT_CLS =
  "rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-[12px] text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 cursor-pointer";

const TABLE_HEADERS = [
  "Challenge",
  "Status",
  "Difficulty",
  "Type",
  "Duration",
  "Actions",
] as const;

// ── Sub-components ─────────────────────────────────────────────────────────────

type StatColor = "teal" | "emerald" | "amber" | "slate";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: StatColor;
}

const STAT_COLOR_MAP: Record<
  StatColor,
  { bg: string; icon: string; text: string }
> = {
  teal: {
    bg: "bg-teal-50",
    icon: "bg-teal-100 text-teal-600",
    text: "text-teal-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-600",
    text: "text-emerald-700",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100 text-amber-600",
    text: "text-amber-700",
  },
  slate: {
    bg: "bg-slate-50",
    icon: "bg-slate-100 text-slate-500",
    text: "text-slate-600",
  },
};

function StatCard({ label, value, icon, color }: StatCardProps) {
  const C = STAT_COLOR_MAP[color];

  return (
    <div
      className={`${C.bg} rounded-2xl px-5 py-4 flex items-center gap-4 border border-white shadow-sm`}
    >
      <div
        className={`${C.icon} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className={`text-xl font-extrabold ${C.text} leading-tight`}>
          {value}
        </p>
      </div>
    </div>
  );
}

interface BadgeProps {
  cls: string;
  children: React.ReactNode;
}

function Badge({ cls, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}
    >
      {children}
    </span>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────────

interface DeleteModalProps {
  target: ChallengeListItem;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({
  target,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-red-500" strokeWidth={1.8} />
        </div>

        <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
          Delete Challenge?
        </h2>

        <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
          You&apos;re about to permanently delete{" "}
          <span className="font-bold text-slate-800">{target.title}</span>. This
          cannot be undone.
        </p>

        <div className="flex gap-2.5 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-[13px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 text-[13px] font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Filters Bar ────────────────────────────────────────────────────────────────

interface FiltersBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: ChallengeStatus | "";
  onStatusChange: (v: ChallengeStatus | "") => void;
  diffFilter: ChallengeDifficulty | "";
  onDiffChange: (v: ChallengeDifficulty | "") => void;
  typeFilter: ChallengeType | "";
  onTypeChange: (v: ChallengeType | "") => void;
  visibilityFilter: ChallengeVisibility | "";
  onVisibilityChange: (v: ChallengeVisibility | "") => void;
  premiumFilter: "" | "true" | "false";
  onPremiumChange: (v: "" | "true" | "false") => void;
  sortBy: ChallengeSortBy;
  onSortChange: (v: ChallengeSortBy) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  resultCount: number;
}

function FiltersBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  diffFilter,
  onDiffChange,
  typeFilter,
  onTypeChange,
  visibilityFilter,
  onVisibilityChange,
  premiumFilter,
  onPremiumChange,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
  resultCount,
}: FiltersBarProps) {
  return (
    <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-2 flex-1">
        {/* Search */}
        <div className="relative group">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search
              size={13}
              className="text-slate-400 group-focus-within:text-teal-500 transition-colors"
            />
          </span>
          <input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="rounded-xl bg-slate-50 border border-slate-200 py-2 pl-8 pr-8 text-[12px] text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 w-48"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <select
          className={SELECT_CLS}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as ChallengeStatus | "")}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <select
          className={SELECT_CLS}
          value={diffFilter}
          onChange={(e) =>
            onDiffChange(e.target.value as ChallengeDifficulty | "")
          }
        >
          <option value="">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          className={SELECT_CLS}
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value as ChallengeType | "")}
        >
          <option value="">All Types</option>
          <option value="fitness">Fitness</option>
          <option value="nutrition">Nutrition</option>
          <option value="mental">Mental</option>
          <option value="hybrid">Hybrid</option>
          <option value="productivity">Productivity</option>
        </select>

        <select
          className={SELECT_CLS}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as ChallengeSortBy)}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title A-Z</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <X size={11} strokeWidth={2.5} />
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <select
          className={SELECT_CLS}
          value={visibilityFilter}
          onChange={(e) =>
            onVisibilityChange(e.target.value as ChallengeVisibility | "")
          }
        >
          <option value="">All Visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <select
          className={SELECT_CLS}
          value={premiumFilter}
          onChange={(e) =>
            onPremiumChange(e.target.value as "" | "true" | "false")
          }
        >
          <option value="">All Access</option>
          <option value="true">Premium</option>
          <option value="false">Free</option>
        </select>

        <p className="text-[11px] text-slate-400 font-medium">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

// ── Challenge Row ──────────────────────────────────────────────────────────────

interface ChallengeRowProps {
  challenge: ChallengeListItem;
  isActing: boolean;
  onPublish: (id: string) => void;
  onDeleteRequest: (challenge: ChallengeListItem) => void;
}

function ChallengeRow({
  challenge,
  isActing,
  onPublish,
  onDeleteRequest,
}: ChallengeRowProps) {
  const st = STATUS_CONFIG[challenge.status];

  return (
    <tr className="hover:bg-slate-50/60 transition-colors duration-150 group">
      <td className="px-5 py-3.5 max-w-[220px]">
        <p className="text-[13px] font-bold text-slate-800 truncate">
          {challenge.title}
        </p>
        {challenge.createdAt && (
          <p className="text-[10px] text-slate-400 mt-0.5">
            {new Date(challenge.createdAt).toLocaleDateString()}
          </p>
        )}
      </td>

      <td className="px-5 py-3.5">
        <Badge cls={`${st.bg} ${st.text}`}>
          {st.icon}
          {challenge.status}
        </Badge>
      </td>

      <td className="px-5 py-3.5">
        <Badge cls={DIFFICULTY_CONFIG[challenge.difficulty]}>
          {challenge.difficulty}
        </Badge>
      </td>

      <td className="px-5 py-3.5">
        <Badge cls={TYPE_CONFIG[challenge.type]}>{challenge.type}</Badge>
      </td>

      <td className="px-5 py-3.5">
        <span className="text-[12px] font-semibold text-slate-600">
          {challenge.duration}d
        </span>
      </td>

      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <Link
            href={`/admin/challenges/${challenge.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
            title="View"
          >
            <Eye size={15} strokeWidth={1.8} />
          </Link>

          <Link
            href={`/admin/challenges/${challenge.id}/edit`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
            title="Edit"
          >
            <Pencil size={15} strokeWidth={1.8} />
          </Link>

          {challenge.status !== "published" && (
            <button
              onClick={() => onPublish(challenge.id)}
              disabled={isActing}
              title="Publish"
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-40"
            >
              {isActing ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Rocket size={15} strokeWidth={1.8} />
              )}
            </button>
          )}

          <button
            onClick={() => onDeleteRequest(challenge)}
            disabled={isActing}
            title="Delete"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
          >
            <Trash2 size={15} strokeWidth={1.8} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ChallengesPage() {
  // ── Data state ───────────────────────────────────────────────────────────────
  const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ChallengeListItem | null>(null);

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<ChallengeSortBy>("latest");
  const [statusFilter, setStatusFilter] = useState<ChallengeStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<ChallengeType | "">("");
  const [diffFilter, setDiffFilter] = useState<ChallengeDifficulty | "">("");
  const [visibilityFilter, setVisibilityFilter] = useState<ChallengeVisibility | "">("");
  const [premiumFilter, setPremiumFilter] = useState<"" | "true" | "false">("");

  const debouncedSearch = useDebounce(search, 500);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = page < totalPages;

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchPage = useCallback(
    async (pageNum: number, replace: boolean) => {
      try {
        if (replace) setInitialLoading(true); else setLoadingMore(true);
        setError(null);

        const res = await adminChallengeService.getChallenges(pageNum, LIMIT, {
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
          type: typeFilter || undefined,
          difficulty: diffFilter || undefined,
          visibility: visibilityFilter || undefined,
          isPremium: premiumFilter === "" ? undefined : premiumFilter === "true",
          sortBy,
        });

        setChallenges((prev) => (replace ? res.data : [...prev, ...res.data]));
        setTotalPages(res.totalPages);
        setTotal(res.total);
        setPage(pageNum);
      } catch (err) {
        console.error(err);
        setError("Failed to load challenges.");
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch, statusFilter, typeFilter, diffFilter, visibilityFilter, premiumFilter, sortBy],
  );

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  // ── Infinite scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingMore && !initialLoading) {
          fetchPage(page + 1, false);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, page, fetchPage, initialLoading]);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total,
      published: challenges.filter((c) => c.status === "published").length,
      draft: challenges.filter((c) => c.status === "draft").length,
      archived: challenges.filter((c) => c.status === "archived").length,
    }),
    [challenges, total],
  );

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handlePublish = async (id: string) => {
    try {
      setActionLoading(id);
      await adminChallengeService.publishChallenge(id);
      setChallenges((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "published" as ChallengeStatus } : c)),
      );
      toast.success("Challenge published!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish challenge.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(deleteTarget.id);
      await adminChallengeService.deleteChallenge(deleteTarget.id);
      setChallenges((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setTotal((t) => t - 1);
      toast.success("Challenge deleted.");
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete challenge.");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Filter helpers ───────────────────────────────────────────────────────────
  const hasActiveFilters = Boolean(
    search || statusFilter || diffFilter || typeFilter ||
    visibilityFilter || premiumFilter || sortBy !== "latest",
  );

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setDiffFilter("");
    setTypeFilter("");
    setVisibilityFilter("");
    setPremiumFilter("");
    setSortBy("latest");
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">
            Challenges
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage fitness, nutrition, and mental health programs.
          </p>
        </div>
        <Link
          href="/admin/challenges/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[12px] font-bold text-white bg-slate-900 rounded-xl hover:bg-teal-600 transition-all duration-200 shadow-sm"
        >
          <Plus size={14} strokeWidth={2.5} />
          Create Challenge
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total"
          value={stats.total}
          icon={<Trophy size={18} strokeWidth={1.8} />}
          color="teal"
        />
        <StatCard
          label="Published"
          value={stats.published}
          icon={<CheckCircle2 size={18} strokeWidth={1.8} />}
          color="emerald"
        />
        <StatCard
          label="Drafts"
          value={stats.draft}
          icon={<FileText size={18} strokeWidth={1.8} />}
          color="amber"
        />
        <StatCard
          label="Archived"
          value={stats.archived}
          icon={<Archive size={18} strokeWidth={1.8} />}
          color="slate"
        />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
        <FiltersBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          diffFilter={diffFilter}
          onDiffChange={setDiffFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          visibilityFilter={visibilityFilter}
          onVisibilityChange={setVisibilityFilter}
          premiumFilter={premiumFilter}
          onPremiumChange={setPremiumFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          resultCount={challenges.length}
        />

        {/* Error */}
        {error && (
          <div className="mx-5 mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-600">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {initialLoading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
                      <Loader2
                        size={20}
                        strokeWidth={1.8}
                        className="animate-spin text-teal-400"
                      />
                      <span className="text-sm font-medium">Loading challenges…</span>
                    </div>
                  </td>
                </tr>
              ) : challenges.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                      <Trophy size={32} strokeWidth={1.2} className="text-slate-300" />
                      <p className="text-sm font-medium">No challenges found</p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-xs text-teal-600 font-semibold hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                challenges.map((challenge) => (
                  <ChallengeRow
                    key={challenge.id}
                    challenge={challenge}
                    isActing={actionLoading === challenge.id}
                    onPublish={handlePublish}
                    onDeleteRequest={setDeleteTarget}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" />

        {loadingMore && (
          <div className="flex items-center justify-center py-5 gap-2 text-slate-400">
            <Loader2 size={16} className="animate-spin text-teal-400" />
            <span className="text-[12px] font-medium">Loading more…</span>
          </div>
        )}

        {!initialLoading && !hasMore && challenges.length > 0 && (
          <p className="text-center py-4 text-[11px] text-slate-400 font-medium">
            All {total} challenges loaded
          </p>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <DeleteModal
          target={deleteTarget}
          isDeleting={actionLoading === deleteTarget.id}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}