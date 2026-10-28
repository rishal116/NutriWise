import type { PostMediaType } from "../../../types/common/post-media.type";

export interface AdminPostAuthorResponseDTO {
  id: string;
  fullName: string;
  profileImage?: string;
}

export interface AdminPostResponseDTO {
  id: string;
  author: AdminPostAuthorResponseDTO;
  content?: string;
  media?: {
    url: string;
    type: PostMediaType;
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}
