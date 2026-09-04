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
  category: ResourceCategory;

  content?: string;
  fileUrl?: string;
  thumbnailUrl?: string;

  status: ResourceStatus;
  publishedAt?: Date;



  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;

  createdAt: Date;
  updatedAt: Date;
}
