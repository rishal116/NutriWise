import { injectable } from "inversify";
import { Types } from "mongoose";

import {
  IResourceView,
  ResourceViewModel,
} from "../../../models/resourceView.model";
import { BaseRepository } from "../common/base.repository";
import { IResourceViewRepository } from "../../interfaces/resource/IResourceViewRepository";

@injectable()
export class ResourceViewRepository
  extends BaseRepository<IResourceView>
  implements IResourceViewRepository
{
  constructor() {
    super(ResourceViewModel);
  }

  async recordView(
    resourceId: string | Types.ObjectId,
    userId?: string | Types.ObjectId,
  ): Promise<IResourceView | null> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    if (!userObjectId) {
      return null;
    }

    const now = new Date();
    const viewDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const filter = {
      resourceId: resourceObjectId,
      userId: userObjectId,
      viewDate,
    };

    try {
      const existingView = await this._model
        .findOneAndUpdate(
          filter,
          {
            $setOnInsert: {
              resourceId: resourceObjectId,
              userId: userObjectId,
              viewDate,
            },
          },
          {
            upsert: true,
            new: false,
          },
        )
        .lean<IResourceView | null>()
        .exec();

      if (existingView) {
        return null;
      }

      return this._model.findOne(filter).lean<IResourceView | null>().exec();
    } catch (error) {
      if (
        error !== null &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 11000
      ) {
        return null;
      }

      throw error;
    }
  }
}
