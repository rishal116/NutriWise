import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { ICommentController } from "../../interfaces/common/ICommentController";
import { ICommentService } from "../../../services/interfaces/common/ICommentService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class CommentController implements ICommentController {
  constructor(
    @inject(TYPES.ICommentService)
    private _commentService: ICommentService
  ) {}

  addComment = asyncHandler(async (req: Request, res: Response) => {
    const { postId, content } = req.body;
    const { userId } = req.user!;

    const comment = await this._commentService.addComment({
      postId: postId as any,
      authorId: userId as any,
      content,
    });

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  });

  getPostComments = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const comments = await this._commentService.getPostComments(postId);

    return res.status(StatusCode.OK).json({
      success: true,
      data: comments,
    });
  });

  deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    await this._commentService.deleteComment(commentId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Comment deleted successfully",
    });
  });
}
