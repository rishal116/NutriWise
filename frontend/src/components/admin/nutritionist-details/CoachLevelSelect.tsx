import { useId } from "react";
import { ChevronDown } from "lucide-react";

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
        className="text-xs font-semibold uppercase tracking-wide text-admin-muted"
      >
        Coach level
      </label>

      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value as CoachLevel)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-admin-border bg-admin-surface-hover py-2.5 pl-4 pr-10 text-sm font-bold text-admin-accent outline-none transition-colors hover:border-admin-accent focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {LEVELS.map((level) => (
            <option
              key={level}
              value={level}
              className="bg-admin-surface text-admin-text"
            >
              {COACH_LEVEL_LABELS[level]}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-admin-muted"
        />
      </div>
    </div>
  );
}