import { Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";
import { IResourceComment } from "../../../models/resourceComment.model";

export interface IResourceCommentRepository
  extends IBaseRepository<IResourceComment> {
  findByResource(
    resourceId: string | Types.ObjectId,
  ): Promise<IResourceComment[]>;

  deleteByResourceAndUser(
    commentId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean>;
}