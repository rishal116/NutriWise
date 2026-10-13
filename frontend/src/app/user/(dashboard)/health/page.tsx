"use client";

import { useCallback, useEffect, useState } from "react";
import { healthDetailsService } from "@/services/user/healthDetails.service";
import HealthDetailsForm from "@/components/ui/profile/HealthDetailsForm";
import {
  Activity,
  Target,
  TrendingUp,
  UtensilsCrossed,
  Pencil,
  Ruler,
  Weight,
} from "lucide-react";
import { HealthDetailsResponseDto } from "@/dtos/user/health/health-details.response.dto";

const fmt = (str?: string) =>
  str ? str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "N/A";

function getBMIStatus(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function getBMIColor(bmi: number) {
  if (bmi < 18.5)
    return {
      pill: "bg-amber-50 text-amber-700 border-amber-200",
      bar: "bg-amber-400",
    };
  if (bmi < 25)
    return {
      pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bar: "bg-emerald-600",
    };
  if (bmi < 30)
    return {
      pill: "bg-amber-50 text-amber-700 border-amber-200",
      bar: "bg-amber-400",
    };
  return {
    pill: "bg-rose-50 text-rose-700 border-rose-200",
    bar: "bg-rose-500",
  };
}

export default function HealthDetailsPage() {
  const [data, setData] = useState<HealthDetailsResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchDetails = useCallback(() => {
    setIsLoading(true);
    healthDetailsService
      .getHealthDetails()
      .then((res) => setData(res))
      .catch((err) => console.error("Fetch Error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <PageTitle />
        <HealthSkeleton />
      </div>
    );
  }

  if (!data || editing) {
    return (
      <HealthDetailsForm
        initialData={data}
        onSuccess={() => {
          setEditing(false);
          fetchDetails();
        }}
      />
    );
  }

  const bmiColor = getBMIColor(data.bmi);
  const bmiPct = Math.min(Math.max(((data.bmi - 10) / 30) * 100, 0), 100);
  const hasTarget = typeof data.targetWeightKg === "number";

  return (
    <div className="mx-auto max-w-6xl p-6">
      <PageTitle onEdit={() => setEditing(true)} />

      {/* BMI + TOP STATS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <StatLabel
              icon={<TrendingUp size={14} className="text-emerald-600" />}
              label="BMI"
            />
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${bmiColor.pill}`}
            >
              {getBMIStatus(data.bmi)}
            </span>
          </div>
          <p className="text-4xl font-extrabold tracking-tight text-slate-900">
            {data.bmi.toFixed(1)}
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${bmiColor.bar}`}
              style={{ width: `${bmiPct}%` }}
            />
          </div>
          <p className="text-xs font-medium text-slate-500">
            Healthy range: 18.5 – 24.9
          </p>
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5">
          <StatLabel
            icon={<Target size={14} className="text-emerald-600" />}
            label="Current Goal"
          />
          <p className="text-lg font-bold leading-snug tracking-tight text-slate-900">
            {fmt(data.goal)}
          </p>
          <p className="text-xs font-medium text-slate-500">
            Timeline:{" "}
            <span className="font-semibold text-slate-900">
              {fmt(data.preferredTimeline)}
            </span>
          </p>
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5">
          <StatLabel
            icon={<Weight size={14} className="text-emerald-600" />}
            label="Target Weight"
          />
          <div className="flex items-end gap-1.5">
            <p className="text-4xl font-extrabold tracking-tight text-slate-900">
              {hasTarget ? data.targetWeightKg : "—"}
            </p>
            {hasTarget && (
              <p className="mb-1 text-sm font-semibold text-slate-400">kg</p>
            )}
          </div>
          <p className="text-xs font-medium text-slate-500">
            Current:{" "}
            <span className="font-semibold text-slate-900">
              {data.weightKg} kg
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <HealthSection title="Body Metrics">
          <MetricTile
            icon={<Ruler size={14} className="text-emerald-600" />}
            label="Height"
            value={`${data.heightCm} cm`}
          />
          <MetricTile
            icon={<Weight size={14} className="text-emerald-600" />}
            label="Weight"
            value={`${data.weightKg} kg`}
          />
          <MetricTile
            icon={<TrendingUp size={14} className="text-emerald-600" />}
            label="BMI Status"
            value={getBMIStatus(data.bmi)}
            highlight
          />
        </HealthSection>

        <HealthSection title="Lifestyle">
          <MetricTile
            icon={<Activity size={14} className="text-emerald-600" />}
            label="Activity Level"
            value={fmt(data.activityLevel)}
          />
        </HealthSection>

        <HealthSection title="Nutrition & Plan">
          <MetricTile
            icon={<UtensilsCrossed size={14} className="text-emerald-600" />}
            label="Diet Type"
            value={fmt(data.dietType)}
          />
          <MetricTile
            icon={<Target size={14} className="text-emerald-600" />}
            label="Timeline"
            value={fmt(data.preferredTimeline)}
          />
        </HealthSection>
      </div>
    </div>
  );
}

function PageTitle({ onEdit }: { onEdit?: () => void }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="h-6 w-1 rounded-full bg-emerald-600" />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Health Profile
        </h1>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
        >
          <Pencil size={14} className="flex-shrink-0" />
          Edit Profile
        </button>
      )}
    </div>
  );
}

function StatLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-shrink-0 rounded-lg bg-emerald-50 p-1.5">{icon}</div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}

function HealthSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
        <span className="h-5 w-1 flex-shrink-0 rounded-full bg-emerald-600" />
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-3.5 transition-colors ${
        highlight
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-100 bg-slate-50 hover:border-emerald-200"
      }`}
    >
      <div className="flex-shrink-0 rounded-lg bg-emerald-50 p-2">{icon}</div>
      <div className="min-w-0">
        <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p
          className={`truncate text-sm font-semibold ${
            highlight ? "text-emerald-700" : "text-slate-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function HealthSkeleton() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>
      <div className="mt-6 space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </>
  );
}
