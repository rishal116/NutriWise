import { inject, injectable } from "inversify";
import type { Request, Response } from "express";

import { TYPES } from "../../../types/types";
import type { IAdminPostController } from "../../interfaces/admin/IAdminPostController";
import type { IAdminPostService } from "../../../services/interfaces/admin/IAdminPostService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class AdminPostController implements IAdminPostController {
  constructor(
    @inject(TYPES.IAdminPostService)
    private readonly adminPostService: IAdminPostService,
  ) {}

  getPosts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const posts = await this.adminPostService.getPosts({
        limit: Number(req.query.limit ?? 10),
        cursor: req.query.cursor as string | undefined,
      });

      res.status(StatusCode.OK).json({
        success: true,
        message: "Admin posts fetched successfully",
        data: posts,
      });
    },
  );

  deletePost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await this.adminPostService.deletePost(req.params.postId);

      res.status(StatusCode.OK).json({
        success: true,
        message: "Post deleted successfully",
      });
    },
  );
}
