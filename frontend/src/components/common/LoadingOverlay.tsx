"use client";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
    </div>
  );
}
