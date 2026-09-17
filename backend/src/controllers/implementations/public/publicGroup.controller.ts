import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";

import { TYPES } from "../../../types/types";

import { StatusCode } from "../../../enums/statusCode.enum";

import { IPublicGroupController } from "../../interfaces/public/IPublicGroupController"; 

import { IPublicGroupService } from "../../../services/interfaces/public/IPublicGroupService";

@injectable()
export class PublicGroupController implements IPublicGroupController {
  constructor(
    @inject(TYPES.IPublicGroupService)
    private readonly _groupService: IPublicGroupService,
  ) {}

  browseGroups = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._groupService.browseGroups(req.query);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Public groups fetched successfully",
      data: result,
    });
  });

  getGroup = asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;

    const result = await this._groupService.getGroup(groupId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Public group details fetched successfully",
      data: result,
    });
  });

  joinGroup = asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;

    const userId = req.user!.userId;

    const result = await this._groupService.joinGroup(userId, groupId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Joined group successfully",
      data: result,
    });
  });
}
