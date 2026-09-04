export enum PostSortOption {
  LATEST = "latest",
  OLDEST = "oldest",
  MOST_LIKED = "most_liked",
  MOST_COMMENTED = "most_commented",
  MOST_BOOKMARKED = "most_bookmarked",
}

export interface PostListQueryDTO {
  limit?: number;
  cursor?: string;
  search?: string;
  sortBy?: PostSortOption;
}
