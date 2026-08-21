import {
  ResourceStatus,
  ResourceType,
} from "@/types/nutritionist/resource/resource.types";

export enum NutriResourceSortBy {
  LATEST = "latest",
  OLDEST = "oldest",
  TITLE_ASC = "title_asc",
  TITLE_DESC = "title_desc",
  MOST_VIEWED = "most_viewed",
  MOST_DOWNLOADED = "most_downloaded",
}

export interface GetNutriResourcesQueryDTO {
  search?: string;
  status?: ResourceStatus;
  type?: ResourceType;
  category?: string;
  sortBy?: NutriResourceSortBy;
  cursor?: string;
  limit?: number;
}
