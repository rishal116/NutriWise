export type PublicResourceSortBy =
  | "LATEST"
  | "OLDEST"
  | "MOST_VIEWED"
  | "MOST_DOWNLOADED"
  | "TITLE_ASC"
  | "TITLE_DESC";

export type PublicResourceType =
  | "article"
  | "pdf"
  | "video"
  | "external_link"
  | "infographic";

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