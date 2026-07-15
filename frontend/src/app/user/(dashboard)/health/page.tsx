"use client";

import { useEffect, useState } from "react";
import { healthDetailsService } from "@/services/user/healthDetails.service";
import HealthDetailsForm from "@/components/ui/profile/HealthDetailsForm";
import {
  Activity,
  Target,
  TrendingUp,
  UtensilsCrossed,
  Pencil,
  Loader2,
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
      pill: "bg-blue-100 text-blue-700 border-blue-200",
      bar: "bg-blue-400",
    };
  if (bmi < 25)
    return {
      pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
      bar: "bg-emerald-500",
    };
  if (bmi < 30)
    return {
      pill: "bg-amber-100 text-amber-700 border-amber-200",
      bar: "bg-amber-400",
    };
  return { pill: "bg-red-100 text-red-600 border-red-200", bar: "bg-red-400" };
}

export default function HealthDetailsPage() {
  const [data, setData] = useState<HealthDetailsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchDetails = () => {
    setLoading(true);
    healthDetailsService
      .getHealthDetails()
      .then((res) => setData(res))
      .catch((err) => console.error("Fetch Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <Loader2 className="w-9 h-9 text-emerald-500 animate-spin mx-auto" />
          <p className="text-emerald-700 font-semibold text-sm tracking-wide">
            Loading health data…
          </p>
        </div>
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
    <div className="font-sans pb-12 space-y-6">
      {/* PAGE HEADER */}
      <div className="bg-emerald-600 rounded-2xl px-7 py-8 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-1">
              Health Profile
            </h1>
            <p className="text-emerald-50 text-sm font-medium">
              Personalised wellness tracking
            </p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <Pencil size={14} className="flex-shrink-0" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* BMI + TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-1.5 rounded-lg flex-shrink-0">
                <TrendingUp size={14} className="text-emerald-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                BMI
              </p>
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${bmiColor.pill}`}
            >
              {getBMIStatus(data.bmi)}
            </span>
          </div>
          <p className="text-4xl font-black text-slate-900">
            {data.bmi.toFixed(1)}
          </p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${bmiColor.bar} rounded-full transition-all duration-700`}
              style={{ width: `${bmiPct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            Healthy range: 18.5 – 24.9
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-teal-100 p-1.5 rounded-lg flex-shrink-0">
              <Target size={14} className="text-teal-600" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Current Goal
            </p>
          </div>
          <p className="text-xl font-extrabold text-slate-900 capitalize leading-snug">
            {fmt(data.goal)}
          </p>
          <p className="text-xs text-slate-400 font-medium">
            Timeline:{" "}
            <span className="text-slate-600 font-semibold capitalize">
              {fmt(data.preferredTimeline)}
            </span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-purple-100 p-1.5 rounded-lg flex-shrink-0">
              <Weight size={14} className="text-purple-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Target Weight
            </p>
          </div>
          <div className="flex items-end gap-1.5">
            <p className="text-4xl font-black text-slate-900">
              {hasTarget ? data.targetWeightKg : "—"}
            </p>
            {hasTarget && (
              <p className="text-sm text-slate-400 font-bold mb-1">kg</p>
            )}
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Current:{" "}
            <span className="text-slate-600 font-semibold">
              {data.weightKg} kg
            </span>
          </p>
        </div>
      </div>

      {/* BODY METRICS */}
      <HealthSection
        icon={<Ruler size={13} className="text-emerald-600" />}
        iconBg="bg-emerald-100"
        title="Body Metrics"
      >
        <MetricTile
          icon={<Ruler size={14} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          label="Height"
          value={`${data.heightCm} cm`}
        />
        <MetricTile
          icon={<Weight size={14} className="text-purple-500" />}
          iconBg="bg-purple-50"
          label="Weight"
          value={`${data.weightKg} kg`}
        />
        <MetricTile
          icon={<TrendingUp size={14} className="text-teal-500" />}
          iconBg="bg-teal-50"
          label="BMI Status"
          value={getBMIStatus(data.bmi)}
          highlight
        />
      </HealthSection>

      {/* LIFESTYLE */}
      <HealthSection
        icon={<Activity size={13} className="text-blue-500" />}
        iconBg="bg-blue-100"
        title="Lifestyle"
      >
        <MetricTile
          icon={<Activity size={14} className="text-blue-500" />}
          iconBg="bg-blue-50"
          label="Activity Level"
          value={fmt(data.activityLevel)}
        />
      </HealthSection>

      {/* NUTRITION & PLAN */}
      <HealthSection
        icon={<UtensilsCrossed size={13} className="text-orange-500" />}
        iconBg="bg-orange-100"
        title="Nutrition & Plan"
      >
        <MetricTile
          icon={<UtensilsCrossed size={14} className="text-orange-500" />}
          iconBg="bg-orange-50"
          label="Diet Type"
          value={fmt(data.dietType)}
        />
        <MetricTile
          icon={<Target size={14} className="text-purple-500" />}
          iconBg="bg-purple-50"
          label="Timeline"
          value={fmt(data.preferredTimeline)}
        />
      </HealthSection>
    </div>
  );
}

function HealthSection({
  title,
  icon,
  iconBg,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-emerald-50 px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
        <div className={`${iconBg} p-1.5 rounded-lg flex-shrink-0`}>{icon}</div>
        <h2 className="text-sm font-extrabold text-slate-900">{title}</h2>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {children}
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  icon,
  iconBg,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
        highlight
          ? "bg-emerald-50 border-emerald-200"
          : "bg-slate-50 border-slate-100 hover:border-emerald-200"
      }`}
    >
      <div className={`${iconBg} p-2 rounded-lg flex-shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm font-bold truncate ${highlight ? "text-emerald-700" : "text-slate-900"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
