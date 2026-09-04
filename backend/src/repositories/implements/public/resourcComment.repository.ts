import { injectable } from "inversify";

import { Types } from "mongoose";

import {
  IResourceComment,
  ResourceCommentModel,
} from "../../../models/resourceComment.model";

import { BaseRepository } from "../common/base.repository";

import { IResourceCommentRepository } from "../../interfaces/public/IResourceCommentRepository";

@injectable()
export class ResourceCommentRepository
  extends BaseRepository<IResourceComment>
  implements IResourceCommentRepository
{
  constructor() {
    super(ResourceCommentModel);
  }

  async findByResource(
    resourceId: string | Types.ObjectId,
  ): Promise<IResourceComment[]> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    return this._model
      .find({
        resourceId: resourceObjectId,
        isDeleted: false,
      })
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  async deleteByResourceAndUser(
    commentId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean> {
    const commentObjectId =
      typeof commentId === "string"
        ? new Types.ObjectId(commentId)
        : commentId;

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const result = await this._model.updateOne(
      {
        _id: commentObjectId,
        userId: userObjectId,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
        },
      },
    );

    return result.modifiedCount > 0;
  }
}