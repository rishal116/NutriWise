import Link from "next/link";
import { Plus, SquarePen } from "lucide-react";

interface PostsEmptyStateProps {
  isSearching: boolean;
  onClearSearch?: () => void;
}

export function PostsEmptyState({ isSearching, onClearSearch }: PostsEmptyStateProps) {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <SquarePen className="h-5 w-5" />
        </span>
        <h3 className="mt-4 text-sm font-bold tracking-tight text-slate-800">
          No posts match your search
        </h3>
        <p className="mt-1 max-w-xs text-xs font-medium text-slate-500">
          Try a different keyword, or clear the search to see all your posts.
        </p>
        {onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
          >
            Clear search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700">
        <SquarePen className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900">
        You haven&apos;t posted yet
      </h3>
      <p className="mt-1 max-w-sm text-xs font-medium text-slate-500">
        Share a meal, a milestone, or a quick update — your posts show up here for you to track and manage.
      </p>
      <Link
        href="/user/posts/create"
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800"
      >
        <Plus className="h-3.5 w-3.5" />
        Create your first post
      </Link>
    </div>
  );
}