import { injectable } from "inversify";

import { Types } from "mongoose";

import {
  IResourceBookmark,
  ResourceBookmarkModel,
} from "../../../models/resourceBookmark.model";

import { BaseRepository } from "../common/base.repository";

import { IResourceBookmarkRepository } from "../../interfaces/public/IResourceBookmarkRepository";

@injectable()
export class ResourceBookmarkRepository
  extends BaseRepository<IResourceBookmark>
  implements IResourceBookmarkRepository
{
  constructor() {
    super(ResourceBookmarkModel);
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