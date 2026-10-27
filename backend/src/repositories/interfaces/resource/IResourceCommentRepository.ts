import { Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";
import { IResourceComment } from "../../../models/resourceComment.model";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IResourceCommentProjection } from "../../../types/resource/resource-comment.projection";

export interface IResourceCommentRepository extends IBaseRepository<IResourceComment> {
  findByResource(
    resourceId: string | Types.ObjectId,
  ): Promise<IResourceCommentProjection[]>;

  findByResourceId(
    resourceId: string | Types.ObjectId,
    limit: number,
    cursor?: string,
  ): Promise<CursorPaginationResult<IResourceCommentProjection>>;

  deleteByResourceAndUser(
    commentId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean>;
}
