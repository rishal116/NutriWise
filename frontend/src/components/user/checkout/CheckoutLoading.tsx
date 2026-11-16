export default function CheckoutLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="space-y-4 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />

        <p className="text-sm font-semibold tracking-wide text-emerald-700">
          Securing your session…
        </p>
      </div>
    </div>
  );
}