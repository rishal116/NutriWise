import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";

import type { IAdminPostRepository } from "../../../repositories/interfaces/admin/IAdminPostRepository";
import type { IAdminPostService } from "../../interfaces/admin/IAdminPostService";
import type {
  IAdminPost,
  IAdminPostQuery,
} from "../../../types/admin/post/post.types";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { AdminPostQueryDTO } from "../../../dtos/admin/post/admin-post.dto";
import type { AdminPostResponseDTO } from "../../../dtos/admin/post/admin-post-response.dto";
import { AdminPostMapper } from "../../../mappers/admin/post/admin-post.mapper";
import { validateDto } from "../../../middlewares/validateDto.middleware";

@injectable()
export class AdminPostService implements IAdminPostService {
  constructor(
    @inject(TYPES.IAdminPostRepository)
    private readonly adminPostRepository: IAdminPostRepository,
  ) {}

  async getPosts(
    query: AdminPostQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminPostResponseDTO>> {
    const validatedQuery = await validateDto(AdminPostQueryDTO, query);

    const repositoryQuery: IAdminPostQuery = {
      limit: validatedQuery.limit,
      cursor: validatedQuery.cursor,
    };

    const result: CursorPaginationResult<IAdminPost> =
      await this.adminPostRepository.getPosts(repositoryQuery);

    return new InfiniteScrollResponseDTO(
      result.items.map(AdminPostMapper.toResponseDTO),
      result.nextCursor,
      result.hasMore,
    );
  }

  async deletePost(postId: string): Promise<void> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new CustomError("Invalid post ID", StatusCode.BAD_REQUEST);
    }

    const post = await this.adminPostRepository.findById(postId);

    if (!post) {
      throw new CustomError("Post not found", StatusCode.NOT_FOUND);
    }

    const deletedCount = await this.adminPostRepository.deleteOne({
      _id: new Types.ObjectId(postId),
    });

    if (deletedCount === 0) {
      throw new CustomError("Post could not be deleted", StatusCode.NOT_FOUND);
    }
  }
}
