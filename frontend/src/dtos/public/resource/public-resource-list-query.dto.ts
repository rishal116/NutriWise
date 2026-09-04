export type PublicResourceSortBy =
  | "latest"
  | "oldest"
  | "most_viewed"
  | "title_asc"
  | "title_desc";

export type PublicResourceType = "article" | "pdf" | "video" | "infographic";

export type PublicResourceCategory =
  | "nutrition"
  | "fitness"
  | "wellness"
  | "recipes";

export interface PublicResourceListQueryDTO {
  limit?: number;
  cursor?: string;
  search?: string;
  type?: PublicResourceType;
  category?: PublicResourceCategory;
  sortBy?: PublicResourceSortBy;
}
