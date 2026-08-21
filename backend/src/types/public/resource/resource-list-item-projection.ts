import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export interface IResourceListItemProjection {
  resourceId: string;

  title: string;
  description: string;

  type: ResourceType;

  thumbnailUrl?: string;

  category: ResourceCategory;

  status: ResourceStatus;

  isDownloadable: boolean;

  viewCount: number;
  downloadCount: number;
  likeCount: number;
  bookmarkCount: number;
  shareCount: number;
  commentCount: number;

  publishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
