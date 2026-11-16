import { Shield } from "lucide-react";

export default function ClientSatisfactionBanner() {
  return (
    <section className="rounded-2xl bg-emerald-950 p-6 text-white">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-xl border border-emerald-400/30 bg-emerald-500/20 p-3">
          <Shield className="text-emerald-400" size={22} />
        </div>

        <div>
          <h3 className="mb-1.5 text-sm font-bold">
            Client Satisfaction Promise
          </h3>

          <p className="text-sm leading-relaxed text-white/70">
            We are committed to helping you achieve real results with expert
            guidance and continuous support throughout your journey.
          </p>
        </div>
      </div>
    </section>
  );
}