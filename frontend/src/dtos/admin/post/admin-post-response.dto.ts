import type { PostMediaType } from "@/types/admin/post/post-media.type";

export interface AdminPostAuthorDTO {
  id: string;
  fullName: string;
  profileImage?: string;
}

export interface AdminPostResponseDTO {
  id: string;
  author: AdminPostAuthorDTO;
  content?: string;
  media?: {
    url: string;
    type: PostMediaType;
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}