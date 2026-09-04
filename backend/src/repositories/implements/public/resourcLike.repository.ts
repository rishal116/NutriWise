import { injectable } from "inversify";

import { Types } from "mongoose";

import {
  IResourceLike,
  ResourceLikeModel,
} from "../../../models/resourceLike.model";

import { BaseRepository } from "../common/base.repository";

import { IResourceLikeRepository } from "../../interfaces/public/IResourceLikeRepository";

@injectable()
export class ResourceLikeRepository
  extends BaseRepository<IResourceLike>
  implements IResourceLikeRepository
{
  constructor() {
    super(ResourceLikeModel);
  }

  async existsByResourceAndUser(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    return !!(await this._model.exists({
      resourceId: resourceObjectId,
      userId: userObjectId,
    }));
  }

  async deleteByResourceAndUser(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const result = await this._model.deleteOne({
      resourceId: resourceObjectId,
      userId: userObjectId,
    });

    return result.deletedCount > 0;
  }
}