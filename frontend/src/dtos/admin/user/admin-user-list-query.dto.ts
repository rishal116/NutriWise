export interface AdminUserListQueryDto {
  skip: number;
  limit: number;
  search?: string;
  sortBy?: "createdAt" | "fullName" | "email";
  sortOrder?: "asc" | "desc";
  isBlocked?: boolean;
}
