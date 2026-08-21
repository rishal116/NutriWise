import {
  PublicResourceCategory,
  PublicResourceType,
} from "./public-resource-list-query.dto";

export interface PublicResourceDetailsDTO {
  resourceId: string;

  title: string;
  description: string;

  type: PublicResourceType;

  content?: string;

  fileUrl?: string;

  externalUrl?: string;

  thumbnailUrl?: string;

  category: PublicResourceCategory;

  isDownloadable: boolean;

  viewCount: number;
  downloadCount: number;
  likeCount: number;
  bookmarkCount: number;
  shareCount: number;
  commentCount: number;

  publishedAt?: string;

  createdAt: string;
  updatedAt: string;
}