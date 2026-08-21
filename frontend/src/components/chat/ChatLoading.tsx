"use client";

interface ChatLoadingProps {
  type?: "conversations" | "messages" | "inline";
}

export default function ChatLoading({ type = "conversations" }: ChatLoadingProps) {
  if (type === "inline") {
    return (
      <div className="flex items-center justify-center py-2 gap-2 text-xs font-medium text-emerald-600">
        <div className="w-3.5 h-3.5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <span>Loading older messages...</span>
      </div>
    );
  }

  if (type === "messages") {
    return (
      <div className="p-6 space-y-4 max-w-4xl mx-auto w-full">
        {/* Left message skeleton */}
        <div className="flex gap-3 items-end animate-pulse">
          <div className="w-8 h-8 rounded-full bg-slate-200" />
          <div className="space-y-1.5 max-w-[60%]">
            <div className="h-10 bg-slate-200 rounded-2xl rounded-bl-none w-48" />
            <div className="h-2.5 bg-slate-100 rounded w-16" />
          </div>
        </div>

        {/* Right message skeleton */}
        <div className="flex justify-end animate-pulse">
          <div className="space-y-1.5 items-end max-w-[60%] flex flex-col">
            <div className="h-12 bg-emerald-100/70 rounded-2xl rounded-br-none w-56" />
            <div className="h-2.5 bg-slate-100 rounded w-16" />
          </div>
        </div>

        {/* Left message skeleton */}
        <div className="flex gap-3 items-end animate-pulse">
          <div className="w-8 h-8 rounded-full bg-slate-200" />
          <div className="space-y-1.5 max-w-[60%]">
            <div className="h-14 bg-slate-200 rounded-2xl rounded-bl-none w-64" />
            <div className="h-2.5 bg-slate-100 rounded w-16" />
          </div>
        </div>

        {/* Right message skeleton */}
        <div className="flex justify-end animate-pulse">
          <div className="space-y-1.5 items-end max-w-[60%] flex flex-col">
            <div className="h-8 bg-emerald-100/70 rounded-2xl rounded-br-none w-36" />
            <div className="h-2.5 bg-slate-100 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex justify-between items-center">
              <div className="h-3.5 bg-slate-200 rounded w-28" />
              <div className="h-2.5 bg-slate-100 rounded w-10" />
            </div>
            <div className="h-3 bg-slate-100 rounded w-44" />
          </div>
        </div>
      ))}
    </div>
  );
}
