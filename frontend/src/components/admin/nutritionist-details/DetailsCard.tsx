import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface DetailsCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export default function DetailsCard({
  icon: Icon,
  title,
  children,
}: DetailsCardProps) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm shadow-admin-text/5 sm:p-6">
      <h2 className="flex items-center gap-2.5 font-semibold text-admin-text">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-admin-accent-soft text-admin-accent">
          <Icon size={18} />
        </span>
        {title}
      </h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}

export function EmptyText({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium text-admin-muted">{children}</p>;
}