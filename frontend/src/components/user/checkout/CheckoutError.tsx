import { AlertCircle } from "lucide-react";

interface CheckoutErrorProps {
  onBack: () => void;
}

export default function CheckoutError({ onBack }: CheckoutErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
          <AlertCircle className="text-rose-600" size={32} />
        </div>

        <p className="mb-5 text-lg font-bold text-rose-600">
          Unable to load the checkout plan.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-rose-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}