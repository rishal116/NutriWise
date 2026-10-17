import type {
  SessionStatus,
  SessionType,
} from "@/types/nutritionist/session/session.types";
import type { NutriSessionListResponseDTO } from "@/dtos/nutritionist/session/session-list-response.dto";
import type { NutriSessionSortOption } from "@/dtos/nutritionist/session/session-list-query.dto";

export const PAGE_LIMIT = 12;

export const TYPE_OPTIONS: { value: SessionType; label: string }[] = [
  { value: "webinar", label: "Webinar" },
  { value: "workshop", label: "Workshop" },
  { value: "group_consultation", label: "Group Consultation" },
  { value: "qna", label: "Q&A" },
  { value: "seminar", label: "Seminar" },
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
  title_asc: "Title A–Z",
  title_desc: "Title Z–A",
  date_asc: "Date: Soonest",
  date_desc: "Date: Latest",
};

export const TYPE_LABELS: Record<SessionType, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  group_consultation: "Group Consultation",
  qna: "Q&A",
  seminar: "Seminar",
};

export const STATUS_STYLES: Record<SessionStatus, string> = {
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export function formatScheduledAt(iso: string) {
  const date = new Date(iso);

  return {
    date: date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export function formatDuration(minutes: number): string {
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
  pricing: NutriSessionListResponseDTO["pricing"],
): string {
  if (pricing.type === "free") {
    return "Free";
  }

  return `₹${pricing.amount.toLocaleString("en-IN")}`;
}
