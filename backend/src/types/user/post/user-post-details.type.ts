import { IPostMedia } from "../../../models/post.model";

export interface IUserPostDetails {
  _id: string;
  authorId: string;
  content?: string;
  media?: IPostMedia;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  createdAt: Date;
  updatedAt: Date;
}