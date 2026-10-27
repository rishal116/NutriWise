import type { PostMediaType } from "@/types/common/post-media.type";

export interface UserLikedPostAuthorDTO {
  authorId: string;
  name: string;
  profileImage?: string;
}

export interface UserLikedPostResponseDTO {
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
  author: UserLikedPostAuthorDTO;
}