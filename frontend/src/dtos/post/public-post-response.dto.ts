import type { PostMediaType } from "@/types/common/post-media.type";

export interface PublicPostAuthorDTO {
  authorId: string;
  name: string;
  profileImage?: string;
}

export interface PublicPostResponseDTO {
  _id: string;
  content?: string;
  media?: {
    url: string;
    type: PostMediaType;
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  isViewedByMe: boolean;
  createdAt: string;
  author: PublicPostAuthorDTO;
}
