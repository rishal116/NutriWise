export interface AdminUserListQueryDto {
  search?: string;

  isBlocked?: boolean;

  sortBy?: "newest" | "oldest";

  cursor?: string;

  limit?: number;
}
