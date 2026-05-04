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

// ── Types ─────────────────────────────────────────────────────────────────────
interface Challenge {
  _id: string;
  title: string;
  status: "draft" | "published" | "archived";
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  type: "fitness" | "nutrition" | "mental" | "hybrid";
  createdAt?: string;
}

interface PaginatedChallenges {
  data: Challenge[];
  page: number;
  totalPages: number;
  total: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const LIMIT = 10;

const STATUS_CONFIG = {
  published: { bg: "bg-teal-50 border-teal-100",   text: "text-teal-700",   icon: <CheckCircle2 size={11} strokeWidth={2.5} /> },
  draft:     { bg: "bg-amber-50 border-amber-100",  text: "text-amber-700",  icon: <FileText     size={11} strokeWidth={2.5} /> },
  archived:  { bg: "bg-slate-100 border-slate-200", text: "text-slate-500",  icon: <Archive      size={11} strokeWidth={2.5} /> },
};

const DIFFICULTY_CONFIG = {
  easy:   "bg-emerald-50 text-emerald-700 border-emerald-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  hard:   "bg-red-50 text-red-600 border-red-100",
};

const TYPE_CONFIG = {
  fitness:   "bg-blue-50 text-blue-700 border-blue-100",
  nutrition: "bg-emerald-50 text-emerald-700 border-emerald-100",
  mental:    "bg-violet-50 text-violet-700 border-violet-100",
  hybrid:    "bg-teal-50 text-teal-700 border-teal-100",
};

const selectCls =
  "rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-[12px] text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 cursor-pointer";

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "teal" | "emerald" | "amber" | "slate";
}) {
  const C = {
    teal:    { bg: "bg-teal-50",    icon: "bg-teal-100 text-teal-600",    text: "text-teal-700"    },
    emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", text: "text-emerald-700" },
    amber:   { bg: "bg-amber-50",   icon: "bg-amber-100 text-amber-600",   text: "text-amber-700"   },
    slate:   { bg: "bg-slate-50",   icon: "bg-slate-100 text-slate-500",   text: "text-slate-600"   },
  }[color];

  return (
    <div className={`${C.bg} rounded-2xl px-5 py-4 flex items-center gap-4 border border-white shadow-sm`}>
      <div className={`${C.icon} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <p className={`text-xl font-extrabold ${C.text} leading-tight`}>{value}</p>
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ cls, children }: { cls: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}
    >
      {children}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore]       = useState(false);
  const [actionLoading, setActionLoading]   = useState<string | null>(null);
  const [error, setError]                   = useState<string | null>(null);

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [diffFilter, setDiffFilter]     = useState("");
  const [typeFilter, setTypeFilter]     = useState("");

  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore     = page < totalPages;

  // ── Fetch page ─────────────────────────────────────────────────────────────
  const fetchPage = useCallback(async (pageNum: number, replace: boolean) => {
    try {
      replace ? setInitialLoading(true) : setLoadingMore(true);
      setError(null);

      const res = await adminChallengeService.getChallenges(pageNum, LIMIT) as PaginatedChallenges;

      setChallenges((prev) => replace ? res.data : [...prev, ...res.data]);
      setTotalPages(res.totalPages);
      setTotal(res.total);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
      setError("Failed to load challenges.");
    } finally {
      replace ? setInitialLoading(false) : setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  // ── Infinite scroll via IntersectionObserver ────────────────────────────────
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchPage(page + 1, false);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, page, fetchPage]);

  // ── Client-side filter on loaded data ──────────────────────────────────────
  const filtered = useMemo(() => {
    return challenges.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (diffFilter && c.difficulty !== diffFilter) return false;
      if (typeFilter && c.type !== typeFilter) return false;
      return true;
    });
  }, [challenges, search, statusFilter, diffFilter, typeFilter]);

  // ── Stats derived from all loaded challenges ────────────────────────────────
  const stats = {
    total,
    published: challenges.filter((c) => c.status === "published").length,
    draft:     challenges.filter((c) => c.status === "draft").length,
    archived:  challenges.filter((c) => c.status === "archived").length,
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const handlePublish = async (id: string) => {
    try {
      setActionLoading(id);
      await adminChallengeService.publishChallenge(id);
      setChallenges((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "published" } : c))
      );
      toast.success("Challenge published!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish challenge.");
    } finally {
      setActionLoading(null);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<Challenge | null>(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(deleteTarget._id);
      await adminChallengeService.deleteChallenge(deleteTarget._id);
      setChallenges((prev) => prev.filter((c) => c._id !== deleteTarget._id));
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

  const anyFilter = search || statusFilter || diffFilter || typeFilter;
  const clearFilters = () => {
    setSearch(""); setStatusFilter(""); setDiffFilter(""); setTypeFilter("");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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
        <StatCard label="Total"     value={stats.total}     icon={<Trophy       size={18} strokeWidth={1.8} />} color="teal"    />
        <StatCard label="Published" value={stats.published} icon={<CheckCircle2 size={18} strokeWidth={1.8} />} color="emerald" />
        <StatCard label="Drafts"    value={stats.draft}     icon={<FileText     size={18} strokeWidth={1.8} />} color="amber"   />
        <StatCard label="Archived"  value={stats.archived}  icon={<Archive      size={18} strokeWidth={1.8} />} color="slate"   />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">

        {/* Filters bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1">
            {/* Search */}
            <div className="relative group">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={13} className="text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              </span>
              <input
                type="text"
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl bg-slate-50 border border-slate-200 py-2 pl-8 pr-8 text-[12px] text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 w-48"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>

            <select className={selectCls} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <select className={selectCls} value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)}>
              <option value="">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select className={selectCls} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="fitness">Fitness</option>
              <option value="nutrition">Nutrition</option>
              <option value="mental">Mental</option>
              <option value="hybrid">Hybrid</option>
            </select>

            {anyFilter && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={11} strokeWidth={2.5} />
                Clear
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 font-medium shrink-0">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

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
                {["Challenge", "Status", "Difficulty", "Type", "Duration", "Actions"].map((h) => (
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
                      <Loader2 size={20} strokeWidth={1.8} className="animate-spin text-teal-400" />
                      <span className="text-sm font-medium">Loading challenges…</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                      <Trophy size={32} strokeWidth={1.2} className="text-slate-300" />
                      <p className="text-sm font-medium">No challenges found</p>
                      {anyFilter && (
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
                filtered.map((c) => {
                  const st = STATUS_CONFIG[c.status];
                  const isActing = actionLoading === c._id;

                  return (
                    <tr key={c._id} className="hover:bg-slate-50/60 transition-colors duration-150 group">
                      {/* Title */}
                      <td className="px-5 py-3.5 max-w-[220px]">
                        <p className="text-[13px] font-bold text-slate-800 truncate">{c.title}</p>
                        {c.createdAt && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <Badge cls={`${st.bg} ${st.text}`}>
                          {st.icon}
                          {c.status}
                        </Badge>
                      </td>

                      {/* Difficulty */}
                      <td className="px-5 py-3.5">
                        <Badge cls={DIFFICULTY_CONFIG[c.difficulty]}>
                          {c.difficulty}
                        </Badge>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-3.5">
                        <Badge cls={TYPE_CONFIG[c.type]}>
                          {c.type}
                        </Badge>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] font-semibold text-slate-600">
                          {c.duration}d
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/challenges/${c._id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                            title="View"
                          >
                            <Eye size={15} strokeWidth={1.8} />
                          </Link>

                          <Link
                            href={`/admin/challenges/${c._id}/edit`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} strokeWidth={1.8} />
                          </Link>

                          {c.status !== "published" && (
                            <button
                              onClick={() => handlePublish(c._id)}
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
                            onClick={() => setDeleteTarget(c)}
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" />

        {/* Load more indicator */}
        {loadingMore && (
          <div className="flex items-center justify-center py-5 gap-2 text-slate-400">
            <Loader2 size={16} className="animate-spin text-teal-400" />
            <span className="text-[12px] font-medium">Loading more…</span>
          </div>
        )}

        {!initialLoading && !hasMore && filtered.length > 0 && (
          <p className="text-center py-4 text-[11px] text-slate-400 font-medium">
            All {total} challenges loaded
          </p>
        )}
      </div>

      {/* ── Delete confirm modal ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={() => setDeleteTarget(null)}
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
              <span className="font-bold text-slate-800">{deleteTarget.title}</span>.
              This cannot be undone.
            </p>
            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 text-[13px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={!!actionLoading}
                className="flex-1 py-2.5 text-[13px] font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {actionLoading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}