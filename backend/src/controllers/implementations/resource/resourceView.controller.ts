import { inject, injectable } from "inversify";
import { Request, Response } from "express";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import { IResourceViewService } from "../../../services/interfaces/resource/IResourceViewService";
import { IResourceViewController } from "../../interfaces/resource/IResourceViewController";

@injectable()
export class ResourceViewController implements IResourceViewController {
  constructor(
    @inject(TYPES.IResourceViewService)
    private readonly _resourceViewService: IResourceViewService,
  ) {}

  recordView = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const userId = req.user?.userId;

    await this._resourceViewService.viewResource(resourceId, userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Resource view recorded successfully",
    });
  });
}
