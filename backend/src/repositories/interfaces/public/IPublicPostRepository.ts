import { Types } from "mongoose";

import { PublicPostListQueryDTO } from "../../../dtos/public/post/public-post-list-query.dto";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { IPublicPostListItemProjection } from "../../../types/public/post/public-post-list-item.projection";

import { IPublicPostDetailsProjection } from "../../../types/public/post/public-post-details.projection";

export interface IPublicPostRepository {
  findPublicPosts(
    query: PublicPostListQueryDTO,
    userId?: string,
  ): Promise<CursorPaginationResult<IPublicPostListItemProjection>>;

  findPublicPostDetails(
    postId: string | Types.ObjectId,
  ): Promise<IPublicPostDetailsProjection | null>;

  findPublicPostsByAuthor(
    authorId: string | Types.ObjectId,
    query: PublicPostListQueryDTO,
  ): Promise<CursorPaginationResult<IPublicPostListItemProjection>>;
}
