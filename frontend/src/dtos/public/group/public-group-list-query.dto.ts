export type PublicGroupSortBy =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc";

export interface PublicGroupListQueryDTO {
  search?: string;
  sortBy?: PublicGroupSortBy;
  cursor?: string;
  limit?: number;
}