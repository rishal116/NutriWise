export function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-zinc-100/80 mb-2">
      <div className="p-2.5 bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200/60 rounded-xl text-zinc-600 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 pt-0.5">
        <h3 className="font-bold text-zinc-900 text-[15px] tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-[13px] text-zinc-500 font-medium mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
