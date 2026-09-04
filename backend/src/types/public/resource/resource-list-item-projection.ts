import { Types } from "mongoose";

import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export interface IResourceListItemProjection {
  resourceId: Types.ObjectId;
  title: string;
  description: string;
  type: ResourceType;
  thumbnailUrl?: string;
  category: ResourceCategory;
  status: ResourceStatus;
  isDownloadable: boolean;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResourceListItemProjectionWithCursor extends IResourceListItemProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}
