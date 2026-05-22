import { IPost } from "../../../models/post.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IPostRepository extends IBaseRepository<IPost> {
  findAllPosts(page: number, limit: number): Promise<IPost[]>;
  findByAuthor(authorId: string, page: number, limit: number): Promise<IPost[]>;
  incrementCommentCount(postId: string): Promise<void>;
}