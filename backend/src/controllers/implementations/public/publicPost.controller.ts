import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

import { IPublicPostController } from "../../interfaces/public/IPublicPostController";
import { IPublicPostService } from "../../../services/interfaces/public/IPublicPostService";
import { transformPublicPostQuery } from "../../../utils/transform-query";

@injectable()
export class PublicPostController implements IPublicPostController {
  constructor(
    @inject(TYPES.IPublicPostService)
    private readonly _postService: IPublicPostService,
  ) {}

  browsePosts = asyncHandler(async (req: Request, res: Response) => {
    const query = await transformPublicPostQuery(req);
    const userId = req.user?.userId;
    const result = await this._postService.browsePosts(query, userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Public posts fetched successfully",
      data: result,
    });
  });

  getPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;

    const result = await this._postService.getPost(postId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Public post details fetched successfully",
      data: result,
    });
  });

  browsePostsByAuthor = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const query = await transformPublicPostQuery(req);

    const result = await this._postService.browsePostsByAuthor(userId, query);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Public author posts fetched successfully",
      data: result,
    });
  });
}
