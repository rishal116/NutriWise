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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="flex items-center gap-2.5 font-semibold text-slate-900">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Icon size={18} />
        </span>
        {title}
      </h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}

export function EmptyText({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium text-slate-400">{children}</p>;
}