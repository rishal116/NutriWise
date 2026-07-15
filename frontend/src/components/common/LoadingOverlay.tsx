"use client";

interface Props {
  text?: string;
}

export default function LoadingOverlay({
  text = "Loading...",
}: Props) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="rounded-xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />

          <p className="text-lg font-medium">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}