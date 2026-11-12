
import { ArrowLeft, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PlanNotFoundState() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 rounded-full bg-red-50 p-4">
        <Info size={36} className="text-red-500" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800">
        Plan not found
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        It seems the plan you&apos;re looking for doesn&apos;t exist.
      </p>

      <button
        type="button"
        onClick={() => router.push("/nutritionist/plans")}
        className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        <ArrowLeft size={16} />
        Back to Plans
      </button>
    </div>
  );
}
