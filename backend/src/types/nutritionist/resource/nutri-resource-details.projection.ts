import { Types } from "mongoose";

import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export interface INutriResourceDetailsProjection {
  resourceId: Types.ObjectId;

  title: string;
  description: string;

  type: ResourceType;

  content?: string;
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;

  category: ResourceCategory;

  status: ResourceStatus;

  publishedAt?: Date;

  isDownloadable: boolean;

  viewCount: number;
  downloadCount: number;
  likeCount: number;
  bookmarkCount: number;
  shareCount: number;
  commentCount: number;

  createdAt: Date;
  updatedAt: Date;
}
