import type {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "@/types/admin/resource/resource.types";

export interface AdminResourceAuthorDTO {
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
  createdBy: AdminResourceAuthorDTO | null;
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}
