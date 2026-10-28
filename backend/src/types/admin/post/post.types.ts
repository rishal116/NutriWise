import { Types } from "mongoose";

import type { PostMediaType } from "../../common/post-media.type";

export interface IAdminPostAuthor {
  _id: Types.ObjectId;
  fullName: string;
  profileImage?: string;
}

export interface IAdminPost {
  _id: Types.ObjectId;
  authorId: IAdminPostAuthor;
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

export interface IAdminPostQuery {
  limit: number;
  cursor?: string;
}
