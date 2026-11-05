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
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm shadow-admin-text/5 sm:p-6">
      <header className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-admin-accent-soft text-admin-accent">
          <Icon size={19} />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-admin-text">{title}</h2>
          <p className="text-xs text-admin-muted">{description}</p>
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
          <dt className="text-xs font-medium text-admin-muted">{label}</dt>
          <dd className="mt-1 break-words text-sm font-semibold text-admin-text">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}