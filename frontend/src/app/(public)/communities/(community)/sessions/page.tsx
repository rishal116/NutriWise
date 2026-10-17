"use client";

import SessionEmptyState from "@/components/public/sessions/SessionEmptyState";
import SessionErrorState from "@/components/public/sessions/SessionErrorState";
import SessionFilters from "@/components/public/sessions/SessionFilters";
import SessionGrid from "@/components/public/sessions/SessionGrid";
import SessionSkeleton from "@/components/public/sessions/SessionSkeleton";
import { usePublicSessions } from "@/hooks/public/usePublicSessions";

const SKELETON_COUNT = 6;

export default function PublicSessionsPage() {
  const {
    sessions,
    searchInput,
    setSearchInput,
    submitSearch,
    type,
    setType,
    pricingType,
    setPricingType,
    sortBy,
    setSortBy,
    hasMore,
    initialLoading,
    loadingMore,
    initialError,
    paginationError,
    observerRef,
    clearFilters,
    retryInitialLoad,
    retryPagination,
    hasActiveFilters,
    sessionTypes,
    pricingTypes,
  } = usePublicSessions();

  const showInitialError = !initialLoading && Boolean(initialError);
  const showEmptyState =
    !initialLoading && !initialError && sessions.length === 0;
  const showSessions = !initialLoading && !initialError && sessions.length > 0;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Sessions
        </h1>

        <p className="text-sm leading-6 text-slate-500">
          Learn, connect, and grow with live sessions from nutritionists.
        </p>
      </header>

      <SessionFilters
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={submitSearch}
        type={type}
        onTypeChange={setType}
        pricingType={pricingType}
        onPricingTypeChange={setPricingType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        sessionTypes={sessionTypes}
        pricingTypes={pricingTypes}
      />

      {initialLoading && (
        <div
          aria-label="Loading sessions"
          aria-busy="true"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <SessionSkeleton key={index} />
          ))}
        </div>
      )}

      {showInitialError && (
        <SessionErrorState
          message={initialError ?? "Unable to load sessions."}
          onRetry={retryInitialLoad}
        />
      )}

      {showEmptyState && (
        <SessionEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      )}

      {showSessions && (
        <>
          <SessionGrid sessions={sessions} />

          {paginationError && (
            <div
              className="flex flex-col items-center gap-2 py-4 text-center"
              role="alert"
            >
              <p className="text-sm text-rose-600">{paginationError}</p>

              <button
                type="button"
                onClick={retryPagination}
                disabled={loadingMore}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Try loading more"}
              </button>
            </div>
          )}

          {hasMore ? (
            <div
              ref={observerRef}
              className="flex min-h-12 items-center justify-center py-4"
              aria-live="polite"
              aria-busy={loadingMore}
            >
              {loadingMore && (
                <p className="text-sm text-slate-400">
                  Loading more sessions...
                </p>
              )}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">
              You&apos;ve reached the end
            </p>
          )}
        </>
      )}
    </section>
  );
}
