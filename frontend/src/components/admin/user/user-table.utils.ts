import type { StatusFilter } from "./user-table.types";

export function getIsBlocked(status: StatusFilter): boolean | undefined {
  if (status === "active") return false;
  if (status === "blocked") return true;
  return undefined;
}

export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDate(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}