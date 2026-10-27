import { Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IPostComment } from "../../../models/postComment.model";
import { IPostCommentResponse } from "../../../types/post/post-comment-response.type";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface IPostCommentRepository extends IBaseRepository<IPostComment> {
  findByPostId(
    postId: Types.ObjectId,
    limit: number,
    cursor?: string,
  ): Promise<CursorPaginationResult<IPostCommentResponse>>;
}
