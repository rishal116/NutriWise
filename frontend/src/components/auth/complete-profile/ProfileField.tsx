"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { XCircle } from "lucide-react";

interface ProfileFieldProps {
  label: string;
  icon: LucideIcon;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

export const profileInputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3.5 text-sm text-gray-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50 sm:py-3";

export default function ProfileField({
  label,
  icon: Icon,
  error,
  optional = false,
  children,
}: ProfileFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}{" "}
        {optional && (
          <span className="font-normal text-gray-400">(optional)</span>
        )}
      </label>

      <div className="relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        {children}
      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <XCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
