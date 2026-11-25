import {
  SESSION_PRICING_TYPES,
  SESSION_TYPES,
  type SessionPricingType,
  type SessionType,
} from "@/constants/common/session.constants";

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  educational: "Educational",
  interactive: "Interactive",
};

export const SESSION_TYPE_OPTIONS = SESSION_TYPES;
export const SESSION_PRICING_OPTIONS = SESSION_PRICING_TYPES;

export const SESSION_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const SESSION_MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;

export const SESSION_FORM_LIMITS = {
  titleMin: 5,
  titleMax: 100,
  descriptionMin: 20,
  descriptionMax: 2000,
} as const;

export const SESSION_INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

export const SESSION_ERROR_CLASS =
  "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20";

export const SESSION_LABEL_CLASS =
  "mb-2 block text-sm font-semibold text-slate-700";

export const SESSION_SECTION_LABEL_CLASS =
  "text-xs font-bold uppercase tracking-wider text-slate-500";

export function toLocalDateTimeInputValue(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export type { SessionPricingType, SessionType };
