import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  HeartPulse,
  Sparkles,
  Users,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-800">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-100 backdrop-blur">
            <Sparkles size={16} />
            Your health, your journey
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build a healthier life with{" "}
            <span className="text-emerald-300">personalized nutrition.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-emerald-50/80 sm:text-lg">
            Connect with certified nutritionists, discover healthier habits, and
            find a community that supports your wellness journey.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/coaching"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-7 py-3.5 font-semibold text-emerald-950 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-300"
            >
              Find a Nutritionist
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/communities/groups"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Community
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-7 border-t border-white/15 pt-7">
            <div className="flex items-center gap-3">
              <HeartPulse className="text-emerald-300" size={23} />
              <span className="text-sm text-emerald-50/90">
                Personalized wellness
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Users className="text-emerald-300" size={23} />
              <span className="text-sm text-emerald-50/90">
                Supportive community
              </span>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-5 rounded-[2rem] bg-emerald-400/10 blur-2xl" />

          <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl bg-white p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <HeartPulse size={25} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Your wellness journey
                  </p>
                  <p className="text-sm text-slate-500">
                    Small steps, lasting habits
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                {[
                  "Personalized nutrition guidance",
                  "Healthy daily habits",
                  "Expert coaching and support",
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                      0{index + 1}
                    </div>

                    <p className="text-sm font-medium text-slate-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
                <p className="text-sm font-semibold text-emerald-900">
                  A healthier you starts today.
                </p>
                <p className="mt-1 text-xs text-emerald-700">
                  Get guidance that fits your lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
