import { PostMediaType } from "@/types/common/post-media.type";

export interface PostMediaResponseDTO {
  url: string;
  type: PostMediaType;
}

export interface PostCardResponseDTO {
  _id: string;
  content?: string;
  media?: PostMediaResponseDTO;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostDetailsResponseDTO extends PostCardResponseDTO {
  authorId: string;
}