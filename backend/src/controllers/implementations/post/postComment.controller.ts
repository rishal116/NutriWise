import { inject, injectable } from "inversify";
import { Request, Response } from "express";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import { IPostCommentService } from "../../../services/interfaces/post/IPostCommentService";
import { IPostCommentController } from "../../interfaces/post/IPostCommentController";

@injectable()
export class PostCommentController implements IPostCommentController {
  constructor(
    @inject(TYPES.IPostCommentService)
    private readonly _postCommentService: IPostCommentService,
  ) {}

  createComment = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user!.userId;

    await this._postCommentService.createComment(postId, userId, content);

    res.status(StatusCode.CREATED).json({
      success: true,
      message: "Comment created successfully",
    });
  });

  getComments = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const limit = Number(req.query.limit) || 10;
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const result = await this._postCommentService.getComments(
      postId,
      limit,
      cursor,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Comments fetched successfully",
      data: result,
    });
  });

  deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user!.userId;

    await this._postCommentService.deleteComment(commentId, userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Comment deleted successfully",
    });
  });
}
