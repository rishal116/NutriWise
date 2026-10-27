import { Types } from "mongoose";

import { IResourceLike } from "../../../models/resourceLike.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IResourceLikeRepository extends IBaseRepository<IResourceLike> {
  existsByResourceAndUser(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean>;

  deleteByResourceAndUser(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean>;
}
