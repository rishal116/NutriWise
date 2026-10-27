import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export class PublicResourceDTO {
  resourceId!: string;
  title!: string;
  description!: string;
  type!: ResourceType;
  category!: ResourceCategory;

  content?: string;
  fileUrl?: string;

  status!: ResourceStatus;
  publishedAt?: Date;

  viewCount!: number;
  likeCount!: number;
  commentCount!: number;

  isLikedByMe!: boolean;
  isViewedByMe!: boolean;

  createdBy!: {
    userId: string;
    fullName: string;
  };

  createdAt!: Date;
  updatedAt!: Date;
}
