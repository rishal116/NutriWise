interface PillProps {
  children: React.ReactNode;
  className?: string;
}

export function Pill({ children, className }: PillProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm ${className ?? ""}`}>
      {children}
    </span>
  );
}