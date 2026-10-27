import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { plainToInstance } from "class-transformer";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { POST_MESSAGES } from "../../../constants";

import { PostListQueryDTO } from "../../../dtos/user/post/post-list-query.dto";
import { IUserLikedPostService } from "../../../services/interfaces/user/post/IUserLikedPostService";
import { IUserLikedPostController } from "../../interfaces/user/IUserLikedPostController";

@injectable()
export class UserLikedPostController implements IUserLikedPostController {
  constructor(
    @inject(TYPES.IUserLikedPostService)
    private readonly _userLikedPostService: IUserLikedPostService,
  ) {}

  browseMyLikedPosts = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const query = plainToInstance(PostListQueryDTO, req.query);

    const posts = await this._userLikedPostService.browseMyLikedPosts(
      userId,
      query,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: POST_MESSAGES.FETCHED,
      data: posts,
    });
  });

  findMyLikedPostDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { postId } = req.params;

    const post = await this._userLikedPostService.findMyLikedPostDetails(
      userId,
      postId,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: POST_MESSAGES.FETCHED_DETAILS,
      data: post,
    });
  });
}
