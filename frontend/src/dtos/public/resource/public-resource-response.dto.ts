import type {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "@/types/resource/resource";

export interface PublicResourceDTO {
  resourceId: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;

  content?: string;
  fileUrl?: string;

  status: ResourceStatus;
  publishedAt?: string;

  viewCount: number;
  likeCount: number;
  commentCount: number;

  isLikedByMe: boolean;
  isViewedByMe: boolean;

  createdBy: {
    userId: string;
    fullName: string;
  };

  createdAt: string;
  updatedAt: string;
}