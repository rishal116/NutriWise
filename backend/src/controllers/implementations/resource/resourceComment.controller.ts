import { inject, injectable } from "inversify";
import { Request, Response } from "express";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import { IResourceCommentService } from "../../../services/interfaces/resource/IResourceCommentService";
import { IResourceCommentController } from "../../interfaces/resource/IResourceCommentController";

@injectable()
export class ResourceCommentController implements IResourceCommentController {
  constructor(
    @inject(TYPES.IResourceCommentService)
    private readonly _resourceCommentService: IResourceCommentService,
  ) {}

  addComment = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const { content } = req.body;
    const userId = req.user!.userId;

    await this._resourceCommentService.addComment(resourceId, userId, content);

    res.status(StatusCode.CREATED).json({
      success: true,
      message: "Comment created successfully",
    });
  });

  getComments = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const limit = Number(req.query.limit) || 10;
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const result = await this._resourceCommentService.getComments(
      resourceId,
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

    await this._resourceCommentService.deleteComment(commentId, userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Comment deleted successfully",
    });
  });
}
