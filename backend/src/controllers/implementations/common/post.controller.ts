import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { IPostController } from "../../interfaces/common/IPostController";
import { IPostService } from "../../../services/interfaces/common/IPostService";

import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class PostController implements IPostController {
  constructor(
    @inject(TYPES.IPostService)
    private _postService: IPostService,
  ) {}

  createPost = asyncHandler(async (req: Request, res: Response) => {
    const { groupId, title, content, mediaUrls } = req.body;
    const { userId } = req.user!;

    const post = await this._postService.createPost({
      groupId,
      authorId: userId,
      title,
      content,
      mediaUrls,
    });

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  });

  getPostById = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;

    const post = await this._postService.getPostById(postId);

    return res.status(StatusCode.OK).json({
      success: true,
      data: post,
    });
  });

  getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const posts = await this._postService.getAllPosts(page, limit);

    return res.status(StatusCode.OK).json({
      success: true,
      data: posts,
    });
  });

  getMyPosts = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const posts = await this._postService.getMyPosts(userId, page, limit);

    return res.status(StatusCode.OK).json({
      success: true,
      data: posts,
    });
  });  updatePost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;

    const updated = await this._postService.updatePost(
      postId,
      req.body,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Post updated successfully",
      data: updated,
    });
  });

  deletePost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;

    await this._postService.deletePost(postId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Post deleted successfully",
    });
  });

  toggleLike = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { userId } = req.user!;

    await this._postService.toggleLike(postId, userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Post like updated",
    });
  });
}