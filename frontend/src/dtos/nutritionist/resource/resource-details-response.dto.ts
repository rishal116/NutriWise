import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "@/types/nutritionist/resource/resource.types";

export interface NutriResourceDetailsResponseDTO {
  resourceId: string;

  title: string;
  description: string;

  type: ResourceType;

  content?: string;
  fileUrl?: string;
  thumbnailUrl?: string;

  category: ResourceCategory;
  status: ResourceStatus;

  publishedAt?: string;



  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;

  createdAt: string;
  updatedAt: string;
}
