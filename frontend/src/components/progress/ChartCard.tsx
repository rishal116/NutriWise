"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  title: string;
  data: { date: string; value: number }[];
  color?: string;
  unit?: string;
}

const ChartCard = ({ title, data, color = "#10b981", unit = "" }: Props) => {
  const gradId = `grad-${title.replace(/\s+/g, "")}`;

  const latest = data.length ? data[data.length - 1].value : null;
  const prev = data.length > 1 ? data[data.length - 2].value : null;
  const delta = latest !== null && prev !== null ? +(latest - prev).toFixed(1) : null;
  const isUp = delta !== null && delta > 0;
  const isDown = delta !== null && delta < 0;

  return (
    <div className="wc-chart-card">
      <div className="wc-chart-header">
        <div className="wc-chart-meta">
          <span className="wc-chart-title">{title}</span>
          {latest !== null && (
            <span className="wc-chart-value">
              {latest}
              <span className="wc-chart-unit">{unit}</span>
            </span>
          )}
        </div>
        {delta !== null && (
          <span
            className={`wc-delta ${isUp ? "wc-delta--up" : isDown ? "wc-delta--down" : "wc-delta--flat"}`}
          >
            {isUp ? "↑" : isDown ? "↓" : "→"} {Math.abs(delta)}{unit}
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(0,0,0,0.05)"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--wc-muted)", fontSize: 11, fontFamily: "var(--wc-font)" }}
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString([], { month: "short", day: "numeric" })
            }
            minTickGap={28}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--wc-muted)", fontSize: 11, fontFamily: "var(--wc-font)" }}
            tickFormatter={(v) => String(+v.toFixed(1))}
          />

          <Tooltip
            contentStyle={{
              background: "var(--wc-surface)",
              border: "1px solid var(--wc-border)",
              borderRadius: 10,
              fontSize: 12,
              fontFamily: "var(--wc-font)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              color: "var(--wc-text)",
            }}
            labelStyle={{ color: "var(--wc-muted)", marginBottom: 4 }}
            labelFormatter={(l) =>
              new Date(l).toLocaleDateString(undefined, { dateStyle: "medium" })
            }
            formatter={(v) => [`${v ?? ""} ${unit}`, ""]}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartCard;