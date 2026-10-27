import { ClientSession } from "mongoose";
import { IBaseRepository } from "../../interfaces/common/IBaseRepository";
import { IPost } from "../../../models/post.model";

export interface IPostRepository extends IBaseRepository<IPost> {
  incrementLikeCount(postId: string, session?: ClientSession): Promise<number>;

  decrementLikeCount(postId: string, session?: ClientSession): Promise<number>;

  incrementCommentCount(
    postId: string,
    session?: ClientSession,
  ): Promise<number>;

  decrementCommentCount(
    postId: string,
    session?: ClientSession,
  ): Promise<number>;
}
