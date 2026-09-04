import { ResourceCommentDTO } from "./resource-comment.dto";

export interface PublicResourceDetailsDTO {
  resourceId: string;
  title: string;
  description?: string;
  type: string;
  content?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  category?: string;
  isDownloadable: boolean;

  isLiked: boolean;
  isBookmarked: boolean;

  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;

  comments: ResourceCommentDTO[];

  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
