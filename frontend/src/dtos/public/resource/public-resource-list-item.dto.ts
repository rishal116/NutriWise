import {
  PublicResourceCategory,
  PublicResourceType,
} from "./public-resource-list-query.dto";

export interface PublicResourceListItemDTO {
  resourceId: string;

  title: string;
  description: string;

  type: PublicResourceType;

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