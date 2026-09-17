export interface AdminPlanListQueryDTO {
  search?: string;
  status?: "draft" | "published" | "archived";
  sortBy?: "newest" | "oldest";
  cursor?: string;
  limit?: number;
}
