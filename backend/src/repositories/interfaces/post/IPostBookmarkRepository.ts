import { ClientSession, Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IPostBookmark } from "../../../models/postBookmark.model";

export interface IPostBookmarkRepository extends IBaseRepository<IPostBookmark> {
  findByPostAndUser(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IPostBookmark | null>;

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
