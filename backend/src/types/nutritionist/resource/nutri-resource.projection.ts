import { Types } from "mongoose";

import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export interface INutriResourceProjection {
  resourceId: Types.ObjectId;
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
  isLikedByMe: boolean;
  isViewedByMe: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INutriResourceListProjectionWithCursor
  extends INutriResourceProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}