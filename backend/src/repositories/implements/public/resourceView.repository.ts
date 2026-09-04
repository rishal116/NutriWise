import { injectable } from "inversify";

import { Types } from "mongoose";

import {
  IResourceView,
  ResourceViewModel,
} from "../../../models/resourceView.model";

import { BaseRepository } from "../common/base.repository";

import { IResourceViewRepository } from "../../interfaces/public/IResourceViewRepository";

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
    sessionId?: string,
  ): Promise<IResourceView | null> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const filter = {
      resourceId: resourceObjectId,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
      ...(userObjectId
        ? { userId: userObjectId }
        : sessionId
          ? { sessionId }
          : {}),
    };

    const existingView = await this._model.findOne(filter).lean();

    if (existingView) {
      return null;
    }

    return this.create({
      resourceId: resourceObjectId,
      ...(userObjectId && {
        userId: userObjectId,
      }),
      ...(sessionId && {
        sessionId,
      }),
    });
  }

  async updateDuration(
    resourceId: string | Types.ObjectId,
    userId?: string | Types.ObjectId,
    sessionId?: string,
    durationSeconds?: number,
  ): Promise<void> {
    if (durationSeconds === undefined || durationSeconds < 0) {
      return;
    }

    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const filter = {
      resourceId: resourceObjectId,
      ...(userObjectId
        ? { userId: userObjectId }
        : sessionId
          ? { sessionId }
          : {}),
    };

    await this._model.updateOne(filter, {
      $set: {
        durationSeconds,
      },
    });
  }
}
