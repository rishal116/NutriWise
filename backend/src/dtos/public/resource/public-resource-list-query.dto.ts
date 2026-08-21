import { ResourceCategory, ResourceType } from "../../../models/resource.model";

export type ResourceSortBy =
  | "LATEST"
  | "OLDEST"
  | "TITLE_ASC"
  | "TITLE_DESC"
  | "MOST_VIEWED"
  | "MOST_DOWNLOADED";

export interface PublicResourceListQueryDTO {
  limit: number;
  cursor?: string;

  search?: string;

  type?: ResourceType;
  category?: ResourceCategory;

  sortBy: ResourceSortBy;
}
