import { ClientSession, Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";
import { IResource } from "../../../models/resource.model";

export interface IResourceRepository extends IBaseRepository<IResource> {
  incrementViewCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number>;

  incrementLikeCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number>;

  decrementLikeCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number>;

  incrementBookmarkCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number>;

  decrementBookmarkCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number>;

  incrementCommentCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number>;

  decrementCommentCount(
    resourceId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number>;
}
