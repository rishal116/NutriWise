import { ClientSession, Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IPostLike } from "../../../models/postLike.model";

export interface IPostLikeRepository extends IBaseRepository<IPostLike> {
  findByPostAndUser(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IPostLike | null>;

  deleteByPostAndUser(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<boolean>;

  countByPostId(
    postId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<number>;
}
