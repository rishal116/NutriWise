import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../../types/types";
import { IUserLikedPostRepository } from "../../../../repositories/interfaces/user/post/IUserLikedPostRepository";
import { IUserLikedPostService } from "../../../interfaces/user/post/IUserLikedPostService";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { IUserLikedPost } from "../../../../types/user/post/user-liked-post.type";
import { PostListQueryDTO } from "../../../../dtos/user/post/post-list-query.dto";
import { CustomError } from "../../../../utils/customError";

@injectable()
export class UserLikedPostService implements IUserLikedPostService {
  constructor(
    @inject(TYPES.IUserLikedPostRepository)
    private readonly _userLikedPostRepository: IUserLikedPostRepository,
  ) {}

  async browseMyLikedPosts(
    userId: string,
    query: PostListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<IUserLikedPost>> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", 400);
    }

    return this._userLikedPostRepository.browseMyLikedPosts(userId, query);
  }

  async findMyLikedPostDetails(
    userId: string,
    postId: string,
  ): Promise<IUserLikedPost> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", 400);
    }

    if (!Types.ObjectId.isValid(postId)) {
      throw new CustomError("Invalid post ID", 400);
    }

    const post = await this._userLikedPostRepository.findMyLikedPostDetails(
      userId,
      postId,
    );

    if (!post) {
      throw new CustomError("Liked post not found", 404);
    }

    return post;
  }
}
