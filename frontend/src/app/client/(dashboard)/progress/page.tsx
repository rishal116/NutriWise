"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  healthProgressService,
  HealthProgressResponse,
} from "@/services/user/healthProgress.service";
import ChartCard from "@/components/progress/ChartCard";
import { Scale, Activity, Droplets, Moon, PlusCircle, ArrowRight, TrendingUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type DayRange = 7 | 30 | 90;

// ─── Metric config ────────────────────────────────────────────────────────────
const METRICS = [
  {
    key: "weightProgress" as const,
    label: "Weight",
    unit: "kg",
    color: "#0f9b8e",
    icon: Scale,
    accent: "#e6f7f5",
    textAccent: "#0a6b63",
    chartTitle: "Weight Trend",
  },
  {
    key: "bmiProgress" as const,
    label: "BMI",
    unit: "",
    color: "#7c4dff",
    icon: Activity,
    accent: "#f0ebff",
    textAccent: "#5533cc",
    chartTitle: "BMI Analysis",
  },
  {
    key: "waterProgress" as const,
    label: "Water",
    unit: "L",
    color: "#1e88e5",
    icon: Droplets,
    accent: "#e3f1fd",
    textAccent: "#1257a3",
    chartTitle: "Hydration",
  },
  {
    key: "sleepProgress" as const,
    label: "Sleep",
    unit: "hrs",
    color: "#8b5cf6",
    icon: Moon,
    accent: "#f3eeff",
    textAccent: "#6030cc",
    chartTitle: "Rest Quality",
  },
] as const;

type MetricKey = (typeof METRICS)[number]["key"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getLatest = (arr?: { value: number }[]): number | null =>
  arr?.length ? arr[arr.length - 1].value : null;

const getDelta = (arr?: { value: number }[]): number | null => {
  if (!arr || arr.length < 2) return null;
  return +(arr[arr.length - 1].value - arr[arr.length - 2].value).toFixed(1);
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  unit,
  delta,
  color,
  accent,
  textAccent,
  Icon,
}: {
  label: string;
  value: number | null;
  unit: string;
  delta: number | null;
  color: string;
  accent: string;
  textAccent: string;
  Icon: React.ElementType;
}) {
  const isUp = delta !== null && delta > 0;
  const isDown = delta !== null && delta < 0;

  return (
    <div className="wc-stat-card">
      <div className="wc-stat-top">
        <div className="wc-stat-icon" style={{ background: accent }}>
          <Icon size={18} color={color} strokeWidth={2} />
        </div>
        {delta !== null && (
          <span
            className={`wc-stat-badge ${
              isUp ? "wc-badge--up" : isDown ? "wc-badge--down" : "wc-badge--flat"
            }`}
          >
            {isUp ? "↑" : isDown ? "↓" : "—"} {Math.abs(delta)}{unit}
          </span>
        )}
      </div>
      <p className="wc-stat-label">{label}</p>
      <p className="wc-stat-value">
        {value !== null ? (
          <>
            {value}
            <span className="wc-stat-unit"> {unit}</span>
          </>
        ) : (
          <span className="wc-stat-empty">—</span>
        )}
      </p>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="wc-skeleton">
      <div className="wc-grid-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="wc-skel-box wc-skel-stat" />
        ))}
      </div>
      <div className="wc-grid-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="wc-skel-box wc-skel-chart" />
        ))}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="wc-empty">
      <div className="wc-empty-icon">
        <TrendingUp size={32} strokeWidth={1.5} />
      </div>
      <h2 className="wc-empty-title">No data for this period</h2>
      <p className="wc-empty-body">
        Log your weight, hydration, and sleep to start seeing trends here.
      </p>
      <Link href="/client/health" className="wc-empty-cta">
        <PlusCircle size={16} />
        Log health details
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HealthProgressPage() {
  const [data, setData] = useState<HealthProgressResponse | null>(null);
  const [days, setDays] = useState<DayRange>(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
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
    };
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
    <>
      {/* ── Global styles scoped to .wc-* ──────────────────────────────────── */}
      <style>{`
        /* ── Tokens ─────────────────────────── */
        :root {
          --wc-font: 'DM Sans', system-ui, sans-serif;
          --wc-bg: #f4f6f3;
          --wc-surface: #ffffff;
          --wc-surface2: #f9faf8;
          --wc-border: #e8ece6;
          --wc-text: #1a1f18;
          --wc-muted: #8a9286;
          --wc-radius: 16px;
          --wc-radius-sm: 10px;
        }

        /* ── Layout ─────────────────────────── */
        .wc-page {
          min-height: 100vh;
          background: var(--wc-bg);
          padding: 2rem 1.25rem 4rem;
          font-family: var(--wc-font);
          color: var(--wc-text);
        }
        .wc-inner {
          max-width: 1140px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* ── Header ─────────────────────────── */
        .wc-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .wc-header-eyebrow {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--wc-muted);
          margin: 0 0 4px;
          font-weight: 500;
        }
        .wc-header-title {
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 600;
          color: var(--wc-text);
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }
        .wc-header-sub {
          font-size: 13.5px;
          color: var(--wc-muted);
          margin: 4px 0 0;
        }

        /* ── Day filter ─────────────────────── */
        .wc-filter {
          display: flex;
          gap: 3px;
          background: var(--wc-surface);
          border: 1px solid var(--wc-border);
          border-radius: var(--wc-radius-sm);
          padding: 3px;
        }
        .wc-filter-btn {
          font-family: var(--wc-font);
          font-size: 13px;
          font-weight: 500;
          padding: 6px 16px;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          background: transparent;
          color: var(--wc-muted);
        }
        .wc-filter-btn:hover { background: var(--wc-bg); color: var(--wc-text); }
        .wc-filter-btn.active {
          background: var(--wc-text);
          color: #fff;
        }

        /* ── Grids ──────────────────────────── */
        .wc-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .wc-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .wc-grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .wc-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .wc-grid-2 { grid-template-columns: 1fr; }
        }

        /* ── Stat Card ──────────────────────── */
        .wc-stat-card {
          background: var(--wc-surface);
          border: 1px solid var(--wc-border);
          border-radius: var(--wc-radius);
          padding: 1.1rem 1.2rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: box-shadow 0.2s;
        }
        .wc-stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .wc-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .wc-stat-icon {
          width: 36px; height: 36px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .wc-stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--wc-muted);
          margin: 0;
        }
        .wc-stat-value {
          font-size: 26px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--wc-text);
          margin: 0;
          line-height: 1;
        }
        .wc-stat-unit { font-size: 13px; font-weight: 400; color: var(--wc-muted); }
        .wc-stat-empty { color: var(--wc-muted); font-weight: 400; }

        /* ── Delta badges ───────────────────── */
        .wc-stat-badge, .wc-delta {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 99px;
        }
        .wc-badge--up, .wc-delta--up { background: #dcfce7; color: #15803d; }
        .wc-badge--down, .wc-delta--down { background: #fee2e2; color: #b91c1c; }
        .wc-badge--flat, .wc-delta--flat { background: #f1f5f9; color: var(--wc-muted); }

        /* ── Chart Card ─────────────────────── */
        .wc-chart-card {
          background: var(--wc-surface);
          border: 1px solid var(--wc-border);
          border-radius: var(--wc-radius);
          padding: 1.25rem 1.4rem 1rem;
          transition: box-shadow 0.2s;
        }
        .wc-chart-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .wc-chart-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .wc-chart-meta { display: flex; flex-direction: column; gap: 2px; }
        .wc-chart-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--wc-muted);
        }
        .wc-chart-value {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--wc-text);
        }
        .wc-chart-unit { font-size: 13px; font-weight: 400; color: var(--wc-muted); margin-left: 3px; }

        /* ── Skeleton ───────────────────────── */
        .wc-skeleton { display: flex; flex-direction: column; gap: 2rem; }
        .wc-skel-box {
          border-radius: var(--wc-radius);
          background: linear-gradient(90deg, #e8ece6 25%, #f2f4f0 50%, #e8ece6 75%);
          background-size: 200% 100%;
          animation: wc-shimmer 1.4s ease-in-out infinite;
        }
        .wc-skel-stat { height: 110px; }
        .wc-skel-chart { height: 300px; }
        @keyframes wc-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Empty State ────────────────────── */
        .wc-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 5rem 2rem;
          text-align: center;
          background: var(--wc-surface);
          border: 1.5px dashed var(--wc-border);
          border-radius: var(--wc-radius);
        }
        .wc-empty-icon {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: var(--wc-bg);
          border: 1px solid var(--wc-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--wc-muted);
        }
        .wc-empty-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: var(--wc-text);
        }
        .wc-empty-body {
          font-size: 14px;
          color: var(--wc-muted);
          max-width: 320px;
          margin: 0;
          line-height: 1.6;
        }
        .wc-empty-cta {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--wc-text);
          color: #fff;
          text-decoration: none;
          font-family: var(--wc-font);
          font-size: 13.5px;
          font-weight: 500;
          padding: 10px 22px;
          border-radius: var(--wc-radius-sm);
          transition: opacity 0.15s;
          margin-top: 0.5rem;
        }
        .wc-empty-cta:hover { opacity: 0.85; }

        /* ── Error banner ───────────────────── */
        .wc-error {
          background: #fff7f7;
          border: 1px solid #fecaca;
          border-radius: var(--wc-radius-sm);
          color: #b91c1c;
          font-size: 13.5px;
          padding: 0.875rem 1.25rem;
        }
      `}</style>

      <div className="wc-page">
        <div className="wc-inner">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="wc-header">
            <div>
              <p className="wc-header-eyebrow">Wellness</p>
              <h1 className="wc-header-title">Health Progress</h1>
              <p className="wc-header-sub">Track your trends over time.</p>
            </div>

            {!loading && !isEmpty && (
              <div className="wc-filter">
                {([7, 30, 90] as DayRange[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`wc-filter-btn${days === d ? " active" : ""}`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── States ─────────────────────────────────────────────────────── */}
          {error ? (
            <div className="wc-error">
              Unable to load health data. Please try refreshing.
            </div>
          ) : loading ? (
            <Skeleton />
          ) : isEmpty ? (
            <EmptyState />
          ) : (
            <>
              {/* ── Stat row ─────────────────────────────────────────────── */}
              <div className="wc-grid-4">
                {METRICS.map(({ key, label, unit, color, accent, textAccent, icon: Icon }) => (
                  <StatCard
                    key={key}
                    label={label}
                    value={getLatest(data?.[key])}
                    unit={unit}
                    delta={getDelta(data?.[key])}
                    color={color}
                    accent={accent}
                    textAccent={textAccent}
                    Icon={Icon}
                  />
                ))}
              </div>

              {/* ── Charts ───────────────────────────────────────────────── */}
              <div className="wc-grid-2">
                {METRICS.map(({ key, color, unit, chartTitle }) => (
                  <ChartCard
                    key={key}
                    title={chartTitle}
                    data={data?.[key] ?? []}
                    color={color}
                    unit={unit}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}