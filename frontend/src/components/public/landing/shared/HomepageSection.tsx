import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HomepageSectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  href?: string;
  linkLabel?: string;
  centered?: boolean;
}

export default function HomepageSection({
  eyebrow,
  title,
  description,
  children,
  href,
  linkLabel = "View all",
  centered = false,
}: HomepageSectionProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div
        className={`mb-9 flex flex-col gap-5 sm:mb-11 sm:flex-row sm:items-end sm:justify-between ${
          centered ? "text-center sm:flex-col sm:items-center" : ""
        }`}
      >
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              {eyebrow}
            </p>
          )}

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {title}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>

        {href && (
          <Link
            href={href}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-600 hover:bg-emerald-50"
          >
            {linkLabel}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}
