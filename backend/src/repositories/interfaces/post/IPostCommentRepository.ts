import { ClientSession, Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IPostComment } from "../../../models/postComment.model";

export interface IPostCommentCursor {
  createdAt: Date;
  id: Types.ObjectId;
}

export interface IPostCommentRepository extends IBaseRepository<IPostComment> {
  findByPostId(
    postId: Types.ObjectId,
    limit: number,
    cursor?: IPostCommentCursor,
  ): Promise<IPostComment[]>;

  deleteById(
    commentId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<boolean>;

  countByPostId(
    postId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<number>;
}
