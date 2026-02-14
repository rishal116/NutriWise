"use client";

import { useRouter } from "next/navigation";

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
    <div className="bg-green-50 px-6 py-4 rounded-b-3xl shadow-sm">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        {title && <h1 className="text-3xl font-semibold text-green-800 mb-2">{title}</h1>}

        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center text-sm text-green-600 gap-2">
          {crumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {crumb.href ? (
                <button
                  onClick={() => router.push(crumb.href!)}
                  className="hover:text-green-800 transition font-medium"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="font-medium text-green-800">{crumb.label}</span>
              )}
              {idx < crumbs.length - 1 && (
                <span className="text-green-400">-</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
