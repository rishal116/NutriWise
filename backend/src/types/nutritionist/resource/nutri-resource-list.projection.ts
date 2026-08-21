import { Types } from "mongoose";

import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export interface INutriResourceListProjection {
  resourceId: Types.ObjectId;

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

  createdAt: Date;
  updatedAt: Date;
}

export interface INutriResourceListProjectionWithCursor extends INutriResourceListProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}
