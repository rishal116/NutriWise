import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description?: string;
  links?: { href: string; label: string }[];
  className?: string;
  children: ReactNode;
}

export default function DashboardCard({
  title,
  description,
  links,
  className = "",
  children,
}: DashboardCardProps) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="h-5 w-1 rounded-full bg-emerald-600" />
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              {title}
            </h2>
          </div>
          {description && (
            <p className="mt-1 pl-3.5 text-xs font-medium text-slate-500">
              {description}
            </p>
          )}
        </div>

        {links && links.length > 0 && (
          <div className="flex shrink-0 items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-1 rounded-lg text-xs font-semibold text-emerald-700 transition-colors duration-150 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              >
                {link.label}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">{children}</div>
    </section>
  );
}
