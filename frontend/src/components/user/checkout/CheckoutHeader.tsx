"use client";

import { ArrowLeft, Lock } from "lucide-react";

interface CheckoutHeaderProps {
  onBack: () => void;
}

export default function CheckoutHeader({
  onBack,
}: CheckoutHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="group mb-1.5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-700"
          >
            <ArrowLeft
              size={16}
              className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to Plans
          </button>

          <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Checkout
          </h1>
        </div>

        <div className="hidden items-center gap-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase sm:flex">
          <Lock size={13} className="shrink-0 text-emerald-600" />
          Secure Encrypted
        </div>
      </div>
    </header>
  );
}