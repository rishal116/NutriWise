interface ProgramInfoRowProps {
  label: string;
  value: string | number;
}

export function ProgramInfoRow({
  label,
  value,
}: ProgramInfoRowProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>

      <span className="break-words text-sm font-medium text-slate-800 sm:text-right">
        {value}
      </span>
    </div>
  );
}