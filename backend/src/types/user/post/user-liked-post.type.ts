import { IUserPost } from "./user-post.type";

export interface IUserLikedPost extends IUserPost {
  author: {
    authorId: string;
    name: string;
    profileImage?: string;
  };
}
