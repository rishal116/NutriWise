import type { PostMediaType } from "@/types/common/post-media.type";
import type { PublicPostAuthorDTO } from "./public-post-author.dto";

export interface PublicPostListItemDTO {
  postId: string;
  content?: string;
  media?: {
    url: string;
    type: PostMediaType;
  };
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  bookmarkCount: number;
  author: PublicPostAuthorDTO;
  createdAt: string;
  updatedAt: string;
}