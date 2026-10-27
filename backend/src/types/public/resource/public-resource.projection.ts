import { Types } from "mongoose";

import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export interface IResourceProjection {
  resourceId: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  content?: string;
  fileUrl?: string;
  status: ResourceStatus;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  downloadCount: number;
  isDownloadable: boolean;
  isLikedByMe?: boolean;
  isViewedByMe?: boolean;
  createdBy: {
    userId: Types.ObjectId;
    fullName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IResourceProjectionWithCursor extends IResourceProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}
