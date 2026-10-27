import { Types } from "mongoose";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { IUserLikedPost } from "../../../../types/user/post/user-liked-post.type";
import { PostListQueryDTO } from "../../../../dtos/user/post/post-list-query.dto";

export interface IUserLikedPostRepository {
  browseMyLikedPosts(
    userId: string | Types.ObjectId,
    query: PostListQueryDTO,
  ): Promise<CursorPaginationResult<IUserLikedPost>>;

  findMyLikedPostDetails(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ): Promise<IUserLikedPost | null>;
}
