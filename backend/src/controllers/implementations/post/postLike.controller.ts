import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { IPostLikeService } from "../../../services/interfaces/post/IPostLikeService";
import { IPostLikeController } from "../../interfaces/post/IPostLikeController";

@injectable()
export class PostLikeController implements IPostLikeController {
  constructor(
    @inject(TYPES.IPostLikeService)
    private readonly _postLikeService: IPostLikeService,
  ) {}

  likePost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.user!.userId;

    await this._postLikeService.likePost(postId, userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Post liked successfully",
    });
  });

  unlikePost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.user!.userId;

    await this._postLikeService.unlikePost(postId, userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Post unliked successfully",
    });
  });
}
