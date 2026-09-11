export const ADMIN_USER_SORT_OPTIONS = ["newest", "oldest"] as const;

export type AdminUserSortBy = (typeof ADMIN_USER_SORT_OPTIONS)[number];

export interface AdminUserListQueryDto {
  search?: string;

  isBlocked?: boolean;

  sortBy?: AdminUserSortBy;

  cursor?: string;

  limit?: number;
}
