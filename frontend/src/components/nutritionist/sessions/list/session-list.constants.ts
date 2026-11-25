import type {
  SessionStatus,
  SessionType,
} from "@/constants/common/session.constants";
import type { NutriSessionListResponseDTO } from "@/dtos/nutritionist/session/session-list-response.dto";
import type { NutriSessionSortOption } from "@/dtos/nutritionist/session/get-nutri-sessions-query.dto";

export const PAGE_LIMIT = 12;

const INDIA_TIME_ZONE = "Asia/Kolkata";

export const TYPE_OPTIONS: { value: SessionType; label: string }[] = [
  { value: "educational", label: "Educational" },
  { value: "interactive", label: "Interactive" },
];

export const STATUS_OPTIONS: { value: SessionStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const SORT_LABELS: Record<NutriSessionSortOption, string> = {
  latest: "Latest",
  oldest: "Oldest",
  date_asc: "Date: Soonest",
  date_desc: "Date: Latest",
};

export const TYPE_LABELS: Record<SessionType, string> = {
  educational: "Educational",
  interactive: "Interactive",
};

export const STATUS_STYLES: Record<SessionStatus, string> = {
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  timeZone: INDIA_TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  timeZone: INDIA_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatScheduledAt(iso: string): {
  date: string;
  time: string;
} {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "Invalid date",
      time: "Invalid time",
    };
  }

  return {
    date: DATE_FORMATTER.format(date),
    time: `${TIME_FORMATTER.format(date)}`,
  };
}

export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "Duration unavailable";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes === 0
    ? `${hours} hr`
    : `${hours} hr ${remainingMinutes} min`;
}

export function formatPrice(
  pricingType: NutriSessionListResponseDTO["pricingType"],
  pricing: NutriSessionListResponseDTO["pricing"],
): string {
  if (pricingType === "free") {
    return "Free";
  }

  if (!pricing || !Number.isFinite(pricing.amount)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: pricing.currency,
    maximumFractionDigits: 2,
  }).format(pricing.amount);
}
