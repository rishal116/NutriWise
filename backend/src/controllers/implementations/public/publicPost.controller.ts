import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IPublicPostController } from "../../interfaces/public/IPublicPostController";
import { IPublicPostService } from "../../../services/interfaces/public/IPublicPostService";

@injectable()
export class PublicPostController implements IPublicPostController {
  constructor(
    @inject(TYPES.IPublicPostService)
    private readonly _postService: IPublicPostService,
  ) {}

  browsePosts = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const result = await this._postService.browsePosts(userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Public posts fetched successfully",
      data: result,
    });
  });

  getPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.user?.userId;

    const result = await this._postService.getPost(postId, userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Public post details fetched successfully",
      data: result,
    });
  });
}
