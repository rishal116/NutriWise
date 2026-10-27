import { Types } from "mongoose";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IPublicPost } from "../../../types/post/public-post.type";

export interface IPublicPostRepository {
  browsePublicPosts(
    userId?: string | Types.ObjectId,
    limit?: number,
    cursor?: string,
  ): Promise<CursorPaginationResult<IPublicPost>>;

  findPublicPostDetails(
    postId: string | Types.ObjectId,
    userId?: string | Types.ObjectId,
  ): Promise<IPublicPost | null>;
}
