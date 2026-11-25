import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";

type SessionStatus = NutriSessionDetailsResponseDTO["status"];
type SessionType = NutriSessionDetailsResponseDTO["type"];

export const STATUS_STYLES: Record<SessionStatus, string> = {
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export const STATUS_DOT: Record<SessionStatus, string> = {
  draft: "bg-slate-400",
  scheduled: "bg-sky-500",
  live: "bg-emerald-500",
  completed: "bg-slate-400",
  cancelled: "bg-rose-500",
};

export const TYPE_LABELS: Record<SessionType, string> = {
  educational: "Educational",
  interactive: "Interactive",
};

export const INDIA_TIME_ZONE = "Asia/Kolkata";