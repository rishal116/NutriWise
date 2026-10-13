import { PostMediaType } from "../../../types/common/post-media.type";

export interface PublicPostAuthorDTO {
  authorId: string;
  name: string;
  profileImage?: string;
}

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
  createdAt: Date;
  updatedAt: Date;
}