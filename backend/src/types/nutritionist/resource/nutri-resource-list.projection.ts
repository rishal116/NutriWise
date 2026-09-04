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
  category: ResourceCategory;

  thumbnailUrl?: string;

  status: ResourceStatus;
  isDownloadable: boolean;

  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface INutriResourceListProjectionWithCursor extends INutriResourceListProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}
