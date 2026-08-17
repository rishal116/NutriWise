"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  crumbs: Crumb[];
}

export default function BreadcrumbHeader({ title, crumbs }: Props) {
  const router = useRouter();

  return (
    <div className="bg-emerald-50 px-6 py-5 rounded-b-2xl shadow-xs border-b border-emerald-100">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
            {title}
          </h1>
        )}

        <div className="flex flex-wrap items-center text-xs sm:text-sm font-medium text-slate-500 gap-1.5">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <div key={idx} className="flex items-center gap-1.5">
                {crumb.href && !isLast ? (
                  <button
                    onClick={() => router.push(crumb.href!)}
                    className="hover:text-emerald-700 transition-colors duration-150"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    className={
                      isLast
                        ? "text-emerald-700 font-semibold"
                        : "text-slate-500"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
