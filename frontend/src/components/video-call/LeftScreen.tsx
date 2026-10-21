"use client";

interface LeftScreenProps {
  onRejoin: () => void;
  onBack: () => void;
}

const LeftScreen = ({ onRejoin, onBack }: LeftScreenProps) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-6 text-center">
    <h1 className="text-2xl font-medium text-white">You left the call</h1>
    <div className="flex flex-wrap justify-center gap-3">
      <button
        type="button"
        onClick={onRejoin}
        className="rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
      >
        Rejoin
      </button>
      <button
        type="button"
        onClick={onBack}
        className="rounded-full bg-neutral-800 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
      >
        Go back
      </button>
    </div>
  </div>
);

export default LeftScreen;