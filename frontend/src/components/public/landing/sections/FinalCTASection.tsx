
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 px-6 py-16 text-center sm:px-12 lg:py-20">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-teal-300/15 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
            <Sparkles size={27} />
          </div>

          <h2 className="mt-7 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your healthier journey starts here.
          </h2>

          <p className="mt-5 text-sm leading-7 text-emerald-50/80 sm:text-base">
            Find expert guidance, build sustainable habits, and become part
            of a community that supports your wellness goals.
          </p>

          <Link
            href="/coaching"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-emerald-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
          >
            Start your journey
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
