import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { IPublicPostRepository } from "../../../repositories/interfaces/public/IPublicPostRepository";
import { IPublicPostService } from "../../interfaces/public/IPublicPostService";
import { CustomError } from "../../../utils/customError";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { PublicPostResponseDTO } from "../../../dtos/post/public-post-response.dto";
import { PublicPostMapper } from "../../../mappers/post/public-post.mapper";

@injectable()
export class PublicPostService implements IPublicPostService {
  constructor(
    @inject(TYPES.IPublicPostRepository)
    private readonly _postRepository: IPublicPostRepository,
  ) {}

  async browsePosts(
    userId?: string,
  ): Promise<InfiniteScrollResponseDTO<PublicPostResponseDTO>> {
    const result = await this._postRepository.browsePublicPosts(userId);

    return new InfiniteScrollResponseDTO(
      result.items.map(PublicPostMapper.toResponse),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getPost(
    postId: string,
    userId?: string,
  ): Promise<PublicPostResponseDTO> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new CustomError("Invalid post ID", 400);
    }

    const post = await this._postRepository.findPublicPostDetails(
      postId,
      userId,
    );

    if (!post) {
      throw new CustomError("Post not found", 404);
    }

    return PublicPostMapper.toResponse(post);
  }
}
