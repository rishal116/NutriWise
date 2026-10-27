import { ClientSession, Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IPostView } from "../../../models/postView.schema";

export interface IPostViewRepository extends IBaseRepository<IPostView> {
  findByPostAndUser(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<IPostView | null>;
}
