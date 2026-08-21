"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ChatErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function ChatError({
  message = "Failed to load chat data. Please check your connection and try again.",
  onRetry,
}: ChatErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 border border-red-100 rounded-2xl my-4 mx-4">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800 mb-1">
        Something went wrong
      </h4>
      <p className="text-xs text-slate-500 max-w-xs mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
}
