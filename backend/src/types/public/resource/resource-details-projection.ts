import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export interface IResourceDetailsProjection {
  resourceId: string;

  title: string;
  description: string;

  type: ResourceType;

  content?: string;

  fileUrl?: string;

  thumbnailUrl?: string;

  category: ResourceCategory;

  status: ResourceStatus;

  publishedAt?: Date;

  isDownloadable: boolean;

  viewCount: number;
  likeCount: number;
  bookmarkCount: number;

  commentCount: number;

  createdAt: Date;
  updatedAt: Date;
}
