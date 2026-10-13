import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { IPublicPostRepository } from "../../../repositories/interfaces/public/IPublicPostRepository";
import { IPublicPostService } from "../../interfaces/public/IPublicPostService";
import { PublicPostListQueryDTO } from "../../../dtos/public/post/public-post-list-query.dto";
import { PublicPostListItemDTO } from "../../../dtos/public/post/public-post-list-item.dto";
import { PublicPostMapper } from "../../../mappers/public/post/public-post.mapper";
import { CustomError } from "../../../utils/customError";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

@injectable()
export class PublicPostService implements IPublicPostService {
  constructor(
    @inject(TYPES.IPublicPostRepository)
    private readonly _postRepository: IPublicPostRepository,
  ) {}

  async browsePosts(
    query: PublicPostListQueryDTO,
    userId?: string,
  ): Promise<InfiniteScrollResponseDTO<PublicPostListItemDTO>> {
    const result = await this._postRepository.findPublicPosts(query, userId);

    return new InfiniteScrollResponseDTO(
      result.items.map(PublicPostMapper.toListItem),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getPost(postId: string): Promise<PublicPostListItemDTO> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new CustomError("Invalid post ID", 400);
    }

    const post = await this._postRepository.findPublicPostDetails(postId);

    if (!post) {
      throw new CustomError("Post not found", 404);
    }

    return PublicPostMapper.toDetails(post);
  }

  async browsePostsByAuthor(
    userId: string,
    query: PublicPostListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicPostListItemDTO>> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid author ID", 400);
    }

    const result = await this._postRepository.findPublicPostsByAuthor(
      userId,
      query,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map(PublicPostMapper.toListItem),
      result.nextCursor,
      result.hasMore,
    );
  }
}
