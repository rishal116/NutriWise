interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-[13px] font-bold text-slate-700 tracking-tight">
          {title}
        </h3>

        {subtitle ? (
          <p className="text-[11px] text-slate-400">{subtitle}</p>
        ) : null}

        <div className="h-px w-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 mt-1" />
      </div>

      {children}
    </div>
  );
}
