import { ClientSession } from "mongoose";

import { IBaseRepository } from "../../interfaces/common/IBaseRepository";
import { IPost } from "../../../models/post.model";

export interface IPostRepository extends IBaseRepository<IPost> {
  incrementLikeCount(postId: string): Promise<number>;

  decrementLikeCount(postId: string): Promise<number>;

  incrementCommentCount(
    postId: string,
    session?: ClientSession,
  ): Promise<number>;

  decrementCommentCount(
    postId: string,
    session?: ClientSession,
  ): Promise<number>;
}
