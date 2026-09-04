import { Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";
import { IResourceLike } from "../../../models/resourceLike.model";

export interface IResourceLikeRepository
  extends IBaseRepository<IResourceLike> {
  existsByResourceAndUser(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean>;

  deleteByResourceAndUser(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean>;
}