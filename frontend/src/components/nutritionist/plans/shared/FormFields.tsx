import { useId, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface Option {
  id: string;
  label: string;
}

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

interface SummaryItemProps {
  label: string;
  value: string;
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  prefix?: ReactNode;
  placeholder?: string;
  inputMode?:
    | "text"
    | "numeric"
    | "decimal"
    | "email"
    | "tel"
    | "search"
    | "url"
    | "none";
}

interface TextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
}

interface SelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function SectionCard({ icon: Icon, title, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-emerald-50 p-2">
          <Icon className="h-5 w-5 text-emerald-600" />
        </div>

        <h2 className="font-bold text-gray-800">{title}</h2>
      </div>

      {children}
    </section>
  );
}

export function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">
        {label}
      </p>

      <p className="line-clamp-1 text-sm font-medium">{value}</p>
    </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  error,
  prefix,
  placeholder,
  inputMode = "text",
}: InputProps) {
  const inputId = useId();

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 ml-1 block text-xs font-bold uppercase text-gray-600"
      >
        {label}
      </label>

      <div className="group relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-600">
            {prefix}
          </span>
        )}

        <input
          id={inputId}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 ${
            prefix ? "pl-11" : "px-4"
          }`}
        />
      </div>

      {error && (
        <p className="ml-1 mt-1 text-[10px] font-semibold text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
}: TextareaProps) {
  const textareaId = useId();

  return (
    <div className="w-full">
      <label
        htmlFor={textareaId}
        className="mb-1.5 ml-1 block text-xs font-bold uppercase text-gray-600"
      >
        {label}
      </label>

      <textarea
        id={textareaId}
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />

      {error && (
        <p className="ml-1 mt-1 text-[10px] font-semibold text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
  error,
  disabled = false,
}: SelectProps) {
  const selectId = useId();

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="mb-1.5 ml-1 block text-xs font-bold uppercase text-gray-600"
      >
        {label}
      </label>

      <select
        id={selectId}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">{disabled ? "Loading..." : `Select ${label}`}</option>

        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="ml-1 mt-1 text-[10px] font-semibold text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
