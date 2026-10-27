import { inject, injectable } from "inversify";
import { Request, Response } from "express";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import { IResourceLikeService } from "../../../services/interfaces/resource/IResourceLikeService";
import { IResourceLikeController } from "../../interfaces/resource/IResourceLikeController";

@injectable()
export class ResourceLikeController implements IResourceLikeController {
  constructor(
    @inject(TYPES.IResourceLikeService)
    private readonly _resourceLikeService: IResourceLikeService,
  ) {}

  likeResource = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const userId = req.user!.userId;

    await this._resourceLikeService.likeResource(resourceId, userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Resource liked successfully",
    });
  });

  unlikeResource = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const userId = req.user!.userId;

    await this._resourceLikeService.unlikeResource(resourceId, userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Resource unliked successfully",
    });
  });
}