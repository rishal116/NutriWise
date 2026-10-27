import { PostMediaType } from "../../../types/common/post-media.type";

export interface PostMediaResponseDTO {
  url: string;
  type: PostMediaType;
}

export interface PostCardResponseDTO {
  _id: string;
  content?: string;
  media?: PostMediaResponseDTO;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  isViewedByMe: boolean;
  createdAt: Date;
}