export const POST_SORT_OPTIONS = [
  "latest",
  "oldest",
  "most_liked",
  "most_commented",
  "most_viewed",
] as const;

export type PostSortOption = (typeof POST_SORT_OPTIONS)[number];

export interface PostListQueryDTO {
  limit?: number;
  cursor?: string;
  search?: string;
  sortBy?: PostSortOption;
}
