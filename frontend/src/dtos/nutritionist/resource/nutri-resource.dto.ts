import type {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "@/types/nutritionist/resource/resource.types";

export interface NutriResourceDTO {
  resourceId: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  status: ResourceStatus;

  content?: string;
  fileUrl?: string;
  publishedAt?: string;

  viewCount: number;
  likeCount: number;
  commentCount: number;

  isLikedByMe?: boolean;
  isViewedByMe?: boolean;

  createdAt: string;
  updatedAt: string;
}
