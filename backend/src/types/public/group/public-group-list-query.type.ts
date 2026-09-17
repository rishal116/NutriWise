export type PublicGroupSortBy =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc";

export interface PublicGroupListQuery {
  search?: string;
  sortBy?: PublicGroupSortBy;
  cursor?: string;
  limit?: number;
}