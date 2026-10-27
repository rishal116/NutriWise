import { PostMediaType } from "../../common/post-media.type";

export interface IUserPostCard {
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
  createdAt: Date;
}