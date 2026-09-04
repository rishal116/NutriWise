import {
  PublicResourceCategory,
  PublicResourceType,
} from "./public-resource-list-query.dto";

export interface PublicResourceCommentDTO {
  commentId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicResourceDetailsDTO {
  resourceId: string;
  title: string;
  description: string;
  type: PublicResourceType;
  content?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  category: PublicResourceCategory;

  isLiked: boolean;
  isBookmarked: boolean;

  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;

  comments: PublicResourceCommentDTO[];

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
