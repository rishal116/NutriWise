import type { Types } from "mongoose";
import type {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export interface IAdminResourceAuthor {
  _id: Types.ObjectId;
  fullName: string;
  profileImage?: string;
}

export interface IAdminResource {
  _id: Types.ObjectId;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  content?: string;
  fileUrl?: string;
  status: ResourceStatus;
  createdBy: IAdminResourceAuthor | null;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminResourceQuery {
  limit: number;
  cursor?: string;
}