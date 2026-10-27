import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { TYPES } from "../../../types/types";
import { IPostViewService } from "../../interfaces/post/IPostViewService";
import { IPostViewRepository } from "../../../repositories/interfaces/post/IPostViewRepository";
import { IPostRepository } from "../../../repositories/interfaces/post/IPostRepository";

@injectable()
export class PostViewService implements IPostViewService {
  constructor(
    @inject(TYPES.IPostViewRepository)
    private readonly postViewRepository: IPostViewRepository,

    @inject(TYPES.IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async viewPost(postId: string, userId: string): Promise<void> {
    this.validateIds(postId, userId);

    const postObjectId = new Types.ObjectId(postId);
    const userObjectId = new Types.ObjectId(userId);

    const post = await this.postRepository.findById(postObjectId);

    if (!post) {
      throw new CustomError("Post not found", StatusCode.NOT_FOUND);
    }

    const existingView = await this.postViewRepository.findByPostAndUser(
      postObjectId,
      userObjectId,
    );

    if (existingView) {
      return;
    }

    await this.postViewRepository.create({
      postId: postObjectId,
      userId: userObjectId,
    });

    await this.postRepository.updateOne(
      { _id: postObjectId },
      { $inc: { viewCount: 1 } },
    );
  }

  private validateIds(postId: string, userId: string): void {
    if (
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      throw new CustomError(
        "Invalid post or user ID",
        StatusCode.BAD_REQUEST,
      );
    }
  }
}