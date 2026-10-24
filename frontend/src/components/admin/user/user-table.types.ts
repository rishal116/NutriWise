export type SortBy = "newest" | "oldest";
export type StatusFilter = "all" | "active" | "blocked";

export const PAGE_SIZE = 10;

export const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];