import {
  Activity,
  Apple,
  CalendarClock,
  Goal,
  Ruler,
  Scale,
  Weight,
} from "lucide-react";
import type { ClientHealthDetailsDTO } from "@/dtos/nutritionist/client/client-response.dto";

interface ClientHealthCardProps {
  health: ClientHealthDetailsDTO;
}

function displayText(value?: string | number | null): string {
  if (value == null || value === "") return "Not provided";
  if (typeof value === "string" && !value.trim()) return "Not provided";
  return String(value);
}

function displayMeasurement(
  value: number | null | undefined,
  unit: string,
): string {
  if (value == null || !Number.isFinite(value) || value <= 0) {
    return "Not provided";
  }

  return `${value} ${unit}`;
}

function HealthMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ClientHealthCard({
  health,
}: ClientHealthCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">
          Health overview
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Health information shared by the client. Confirm details with them
          when needed.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <HealthMetric
          icon={<Ruler size={17} aria-hidden="true" />}
          label="Height"
          value={displayMeasurement(health.heightCm, "cm")}
        />

        <HealthMetric
          icon={<Scale size={17} aria-hidden="true" />}
          label="Current weight"
          value={displayMeasurement(health.weightKg, "kg")}
        />

        <HealthMetric
          icon={<Activity size={17} aria-hidden="true" />}
          label="Activity level"
          value={displayText(health.activityLevel)}
        />

        <HealthMetric
          icon={<Apple size={17} aria-hidden="true" />}
          label="Diet type"
          value={displayText(health.dietType)}
        />

        <HealthMetric
          icon={<Goal size={17} aria-hidden="true" />}
          label="Primary goal"
          value={displayText(health.goal)}
        />

        <HealthMetric
          icon={<Weight size={17} aria-hidden="true" />}
          label="Target weight"
          value={displayMeasurement(health.targetWeightKg, "kg")}
        />

        <HealthMetric
          icon={<CalendarClock size={17} aria-hidden="true" />}
          label="Preferred timeline"
          value={displayText(health.preferredTimeline)}
        />
      </div>
    </section>
  );
}