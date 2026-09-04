import { ResourceCategory, ResourceType } from "../../../models/resource.model";

export type ResourceSortBy =
  | "latest"
  | "oldest"
  | "title_asc"
  | "title_desc"
  | "most_viewed"

export interface PublicResourceListQueryDTO {
  limit: number;
  cursor?: string;
  search?: string;
  type?: ResourceType;
  category?: ResourceCategory;
  sortBy: ResourceSortBy;
}
