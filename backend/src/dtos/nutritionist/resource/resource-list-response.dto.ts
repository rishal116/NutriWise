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

  thumbnailUrl?: string;

  category!: ResourceCategory;

  status!: ResourceStatus;

  isDownloadable!: boolean;

  viewCount!: number;
  downloadCount!: number;
  likeCount!: number;
  bookmarkCount!: number;
  shareCount!: number;
  commentCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
