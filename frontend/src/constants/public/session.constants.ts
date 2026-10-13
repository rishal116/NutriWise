import type { PublicSessionSortOption } from "@/dtos/public/session/public-session-list-query.dto";
import type { SessionType } from "@/types/public/session/session.types";

export const PUBLIC_SESSION_LIMIT = 12;

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  group_consultation: "Group Consultation",
  qna: "Q&A",
  seminar: "Seminar",
};

export const SESSION_SORT_OPTIONS: {
  value: PublicSessionSortOption;
  label: string;
}[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_low_to_high", label: "Price: Low to High" },
  { value: "price_high_to_low", label: "Price: High to Low" },
];
