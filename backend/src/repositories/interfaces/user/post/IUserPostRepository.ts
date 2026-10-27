import { Types } from "mongoose";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { IUserPost } from "../../../../types/user/post/user-post.type";
import { IBaseRepository } from "../../common/IBaseRepository";
import { IPost } from "../../../../models/post.model";
import { PostListQueryDTO } from "../../../../dtos/user/post/post-list-query.dto";

export interface IUserPostRepository extends IBaseRepository<IPost> {
  browseMyPosts(
    userId: string | Types.ObjectId,
    query: PostListQueryDTO,
  ): Promise<CursorPaginationResult<IUserPost>>;

  findMyPostDetails(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ): Promise<IUserPost | null>;
}
