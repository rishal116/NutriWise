export interface SessionQueryDTO {
  page: number;
  limit: number;
  search?: string;
  status?: "scheduled" | "live" | "ended" | "cancelled";
  type?: "free" | "paid";
  sortBy?: "scheduledAt" | "createdAt";
  sortOrder?: "asc" | "desc";
}