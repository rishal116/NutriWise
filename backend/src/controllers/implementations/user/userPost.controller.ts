import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { StatusCode } from "../../../enums/statusCode.enum";

import { asyncHandler } from "../../../utils/asyncHandler";

import { IUserPostController } from "../../interfaces/user/IUserPostController";

import { IUserPostService } from "../../../services/interfaces/user/IUserPostSservice";

import { POST_MESSAGES } from "../../../constants";
import { plainToInstance } from "class-transformer";
import { PostListQueryDTO } from "../../../dtos/user/post/post-list-query.dto";

@injectable()
export class UserPostController implements IUserPostController {
  constructor(
    @inject(TYPES.IUserPostService)
    private readonly _userPostService: IUserPostService,
  ) {}

  createPost = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const post = await this._userPostService.createPost(
      userId,
      req.body,
      req.file,
    );

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: POST_MESSAGES.CREATED,
      data: post,
    });
  });

  browseMyPosts = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const query = plainToInstance(PostListQueryDTO, req.query);

    const posts = await this._userPostService.browseMyPosts(userId, query);

    return res.status(StatusCode.OK).json({
      success: true,
      message: POST_MESSAGES.FETCHED,
      data: posts,
    });
  });

  findMyPostDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { postId } = req.params;

    const post = await this._userPostService.findMyPostDetails(userId, postId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: POST_MESSAGES.FETCHED_DETAILS,
      data: post,
    });
  });

  updatePost = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { postId } = req.params;

    const post = await this._userPostService.updatePost(
      userId,
      postId,
      req.body,
      req.file,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: POST_MESSAGES.UPDATED,
      data: post,
    });
  });

  deletePost = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { postId } = req.params;

    await this._userPostService.deletePost(userId, postId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: POST_MESSAGES.DELETED,
    });
  });
}
