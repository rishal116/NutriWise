import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export class NutriResourceListItemDTO {
  resourceId!: string;

  title!: string;
  description!: string;

  type!: ResourceType;
  category!: ResourceCategory;

  thumbnailUrl?: string;

  status!: ResourceStatus;
  isDownloadable?: boolean;

  viewCount!: number;
  downloadCount?: number;
  likeCount!: number;
  bookmarkCount!: number;
  commentCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
