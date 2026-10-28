import type {
  IAdminPost,
  IAdminPostQuery,
} from "../../../types/admin/post/post.types";
import type { IPost } from "../../../models/post.model";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { IBaseRepository } from "../common/IBaseRepository";

export interface IAdminPostRepository extends IBaseRepository<IPost> {
  getPosts(query: IAdminPostQuery): Promise<CursorPaginationResult<IAdminPost>>;
}
