import type {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export interface AdminResourceAuthorResponseDTO {
  id: string;
  fullName: string;
  profileImage?: string;
}

export interface AdminResourceResponseDTO {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  content?: string;
  fileUrl?: string;
  status: ResourceStatus;
  createdBy: AdminResourceAuthorResponseDTO | null;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}