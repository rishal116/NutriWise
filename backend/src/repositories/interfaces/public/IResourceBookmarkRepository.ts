import { Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";
import { IResourceBookmark } from "../../../models/resourceBookmark.model";

export interface IResourceBookmarkRepository
  extends IBaseRepository<IResourceBookmark> {
  existsByResourceAndUser(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean>;

  deleteByResourceAndUser(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean>;
}