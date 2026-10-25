import { useId } from "react";

import type { CoachLevel } from "@/types/nutritionist.types";

import { COACH_LEVEL_LABELS } from "../nutritionist/nutritionist-table.types";

const LEVELS = Object.keys(COACH_LEVEL_LABELS) as CoachLevel[];

interface CoachLevelSelectProps {
  value: CoachLevel;
  disabled: boolean;
  onChange: (level: CoachLevel) => void;
}

export default function CoachLevelSelect({
  value,
  disabled,
  onChange,
}: CoachLevelSelectProps) {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-slate-400"
      >
        Coach level
      </label>

      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as CoachLevel)}
        className="mt-1.5 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-emerald-700 outline-none transition hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {LEVELS.map((level) => (
          <option key={level} value={level}>
            {COACH_LEVEL_LABELS[level]}
          </option>
        ))}
      </select>
    </div>
  );
}
