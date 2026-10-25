import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <header className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Icon size={19} />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </header>

      <div className="mt-6">{children}</div>
    </section>
  );
}

export interface DetailEntry {
  label: string;
  value: string | number;
}

export function DetailList({ items }: { items: DetailEntry[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
      {items.map(({ label, value }) => (
        <div key={label} className="min-w-0">
          <dt className="text-xs font-medium text-slate-500">{label}</dt>
          <dd className="mt-1 break-words text-sm font-semibold text-slate-800">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
