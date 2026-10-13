import { PostMediaType } from "../../../types/common/post-media.type";

export interface IPublicPostListItemProjection {
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
  author: {
    authorId: string;
    name: string;
    profileImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPublicPostListProjectionWithCursor extends IPublicPostListItemProjection {
  cursorId: string;
  cursorValue: Date;
}
