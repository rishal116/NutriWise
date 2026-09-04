import { PostMediaType } from "../../common/post-media.type";

export interface IUserPostCard {
  _id: string;
  content?: string;
  media?: {
    url: string;
    type: PostMediaType;
  };
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  createdAt: Date;
  updatedAt: Date;
}
