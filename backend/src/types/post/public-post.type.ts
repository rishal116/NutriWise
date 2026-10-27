import { IUserPost } from "../user/post/user-post.type";

export interface IPublicPostAuthor {
  authorId: string;
  name: string;
  profileImage?: string;
}

export interface IPublicPost extends IUserPost {
  author: IPublicPostAuthor;
}