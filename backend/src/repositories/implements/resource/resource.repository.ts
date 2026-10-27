import { injectable } from "inversify";
import { ClientSession, Types } from "mongoose";

import { IResource, ResourceModel } from "../../../models/resource.model";
import { BaseRepository } from "../common/base.repository";
import { IResourceRepository } from "../../interfaces/resource/IResourceRepository";

@injectable()
export class ResourceRepository
  extends BaseRepository<IResource>
  implements IResourceRepository
{
  constructor() {
    super(ResourceModel);
  }

  async incrementViewCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model.updateOne(
      { _id: resourceId, status: "published" },
      { $inc: { viewCount: 1 } },
      { session },
    );

    return result.modifiedCount;
  }

  async incrementLikeCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model.updateOne(
      { _id: resourceId, status: "published" },
      { $inc: { likeCount: 1 } },
      { session },
    );

    return result.modifiedCount;
  }

  async decrementLikeCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
        likeCount: { $gt: 0 },
      },
      { $inc: { likeCount: -1 } },
      { session },
    );

    return result.modifiedCount;
  }

  async incrementBookmarkCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model.updateOne(
      { _id: resourceId, status: "published" },
      { $inc: { bookmarkCount: 1 } },
      { session },
    );

    return result.modifiedCount;
  }

  async decrementBookmarkCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
        bookmarkCount: { $gt: 0 },
      },
      { $inc: { bookmarkCount: -1 } },
      { session },
    );

    return result.modifiedCount;
  }

  async incrementCommentCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model.updateOne(
      { _id: resourceId, status: "published" },
      { $inc: { commentCount: 1 } },
      { session },
    );

    return result.modifiedCount;
  }

  async decrementCommentCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
        commentCount: { $gt: 0 },
      },
      { $inc: { commentCount: -1 } },
      { session },
    );

    return result.modifiedCount;
  }
}
