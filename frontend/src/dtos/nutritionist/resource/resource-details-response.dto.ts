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
  externalUrl?: string;
  thumbnailUrl?: string;

  category: ResourceCategory;

  status: ResourceStatus;

  publishedAt?: Date;

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
