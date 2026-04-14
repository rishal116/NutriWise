import React from "react";

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-4 w-64 bg-slate-100 rounded-lg" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between">
              <div className="h-10 w-10 bg-slate-100 rounded-xl" />
              <div className="h-6 w-12 bg-slate-50 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-slate-100 rounded" />
              <div className="h-7 w-24 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-slate-100 rounded-2xl border border-slate-200/50" />
        <div className="h-[400px] bg-slate-50 rounded-2xl border border-slate-200/50" />
      </div>
    </div>
  );
}