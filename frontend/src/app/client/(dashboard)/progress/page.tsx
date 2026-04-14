"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  healthProgressService,
  HealthProgressResponse,
} from "@/services/user/healthProgress.service";
import ChartCard from "@/components/progress/ChartCard";
import {
  Scale,
  Activity,
  Droplets,
  Moon,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";

/* ── TYPES ── */
type DayRange = 7 | 30 | 90;

/* ── METRIC CONFIG ── */
const METRICS = [
  {
    key:        "weightProgress" as const,
    label:      "Weight",
    unit:       "kg",
    icon:       Scale,
    iconBg:     "bg-teal-100",
    iconColor:  "text-teal-600",
    chartColor: "#0f9b8e",
    chartTitle: "Weight Trend",
  },
  {
    key:        "bmiProgress" as const,
    label:      "BMI",
    unit:       "",
    icon:       Activity,
    iconBg:     "bg-purple-100",
    iconColor:  "text-purple-500",
    chartColor: "#7c4dff",
    chartTitle: "BMI Analysis",
  },
  {
    key:        "waterProgress" as const,
    label:      "Water",
    unit:       "L",
    icon:       Droplets,
    iconBg:     "bg-blue-100",
    iconColor:  "text-blue-500",
    chartColor: "#1e88e5",
    chartTitle: "Hydration",
  },
  {
    key:        "sleepProgress" as const,
    label:      "Sleep",
    unit:       "hrs",
    icon:       Moon,
    iconBg:     "bg-indigo-100",
    iconColor:  "text-indigo-500",
    chartColor: "#8b5cf6",
    chartTitle: "Rest Quality",
  },
] as const;

type MetricKey = (typeof METRICS)[number]["key"];

/* ── HELPERS ── */
const getLatest = (arr?: { value: number }[]) =>
  arr?.length ? arr[arr.length - 1].value : null;

const getDelta = (arr?: { value: number }[]) => {
  if (!arr || arr.length < 2) return null;
  return +(arr[arr.length - 1].value - arr[arr.length - 2].value).toFixed(1);
};

/* ── STAT CARD ── */
function StatCard({
  label,
  value,
  unit,
  delta,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label:      string;
  value:      number | null;
  unit:       string;
  delta:      number | null;
  icon:       React.ElementType;
  iconBg:     string;
  iconColor:  string;
}) {
  const isUp   = delta !== null && delta > 0;
  const isDown = delta !== null && delta < 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      {/* top row */}
      <div className="flex items-center justify-between">
        <div className={`${iconBg} p-2 rounded-lg flex-shrink-0`}>
          <Icon size={15} className={iconColor} />
        </div>
        {delta !== null && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            isUp   ? "bg-red-50 text-red-500"
            : isDown ? "bg-emerald-50 text-emerald-600"
            : "bg-gray-100 text-gray-400"
          }`}>
            {isUp ? "↑" : isDown ? "↓" : "—"}&nbsp;{Math.abs(delta)}{unit}
          </span>
        )}
      </div>

      {/* label */}
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </p>

      {/* value */}
      <p className="text-3xl font-extrabold text-gray-900 leading-none">
        {value !== null ? (
          <>
            {value}
            {unit && <span className="text-sm font-medium text-gray-400 ml-1">{unit}</span>}
          </>
        ) : (
          <span className="text-gray-300 font-medium text-xl">No data</span>
        )}
      </p>
    </div>
  );
}

/* ── PAGE ── */
export default function HealthProgressPage() {
  const [data,    setData]    = useState<HealthProgressResponse | null>(null);
  const [days,    setDays]    = useState<DayRange>(30);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        setError(false);
        const res = await healthProgressService.getHealthProgress(days);
        if (!cancelled) setData(res);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [days]);

  const isEmpty =
    !data ||
    (data.weightProgress.length === 0 &&
      data.bmiProgress.length === 0 &&
      data.waterProgress.length === 0 &&
      data.sleepProgress.length === 0);

  return (
    <div className="font-sans pb-12 space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl px-7 py-9 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-14 -mt-14 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-8 -mb-8 blur-2xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">
              Wellness
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1">
              Health Progress
            </h1>
            <p className="text-white/70 text-sm font-medium">
              Track your trends over time
            </p>
          </div>

          {/* Day range filter */}
          {!loading && !isEmpty && (
            <div className="flex-shrink-0 flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-xl p-1">
              {([7, 30, 90] as DayRange[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    days === d
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-sm text-red-600 font-semibold">
          Unable to load health data. Please try refreshing.
        </div>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <Loader2 className="w-9 h-9 text-emerald-500 animate-spin mx-auto" />
            <p className="text-emerald-700 font-semibold text-sm tracking-wide">
              Loading health data…
            </p>
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && !error && isEmpty && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-5">
            <TrendingUp className="text-emerald-400" size={28} />
          </div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-2">
            No data for this period
          </h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed mb-6">
            Log your weight, hydration, and sleep to start seeing trends here.
          </p>
          <Link
            href="/client/health"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <PlusCircle size={15} className="flex-shrink-0" />
            Log health details
            <ArrowRight size={14} className="flex-shrink-0" />
          </Link>
        </div>
      )}

      {/* ── DATA ── */}
      {!loading && !error && !isEmpty && data && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {METRICS.map(({ key, label, unit, icon, iconBg, iconColor }) => (
              <StatCard
                key={key}
                label={label}
                value={getLatest(data[key])}
                unit={unit}
                delta={getDelta(data[key])}
                icon={icon}
                iconBg={iconBg}
                iconColor={iconColor}
              />
            ))}
          </div>

          {/* Chart cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-1 h-4 bg-emerald-500 rounded-full flex-shrink-0" />
              <h2 className="text-sm font-extrabold text-gray-900">Trends</h2>
              <span className="ml-auto text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Last {days} days
              </span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {METRICS.map(({ key, chartColor, unit, chartTitle }) => (
                <div
                  key={key}
                  className="bg-gray-50 rounded-xl border border-gray-100 p-4"
                >
                  {/* Chart header */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
                      {chartTitle}
                    </p>
                    {(() => {
                      const latest = getLatest(data[key]);
                      const delta  = getDelta(data[key]);
                      const isUp   = delta !== null && delta > 0;
                      const isDown = delta !== null && delta < 0;
                      return latest !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-gray-900">
                            {latest}{unit && <span className="text-xs font-medium text-gray-400 ml-0.5">{unit}</span>}
                          </span>
                          {delta !== null && (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                              isUp   ? "bg-red-50 text-red-500"
                              : isDown ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-400"
                            }`}>
                              {isUp ? "↑" : isDown ? "↓" : "—"}{Math.abs(delta)}
                            </span>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>

                  <ChartCard
                    title={chartTitle}
                    data={data[key] ?? []}
                    color={chartColor}
                    unit={unit}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}