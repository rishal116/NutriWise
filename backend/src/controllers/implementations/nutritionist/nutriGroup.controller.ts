import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { INutriGroupController } from "../../interfaces/nutritionist/INutriGroupController";
import { StatusCode } from "../../../enums/statusCode.enum";
import { INutriGroupService } from "../../../services/interfaces/nutritionist/INutriGroupService";

@injectable()
export class NutriGroupController implements INutriGroupController {
  constructor(
    @inject(TYPES.INutriGroupService)
    private _groupService: INutriGroupService,
  ) {}

  createGroup = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const { title, description, isPublic } = req.body;

    const group = await this._groupService.createGroup(userId, {
      title,
      description,
      isPublic,
    });

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: "Group created successfully",
      data: group,
    });
  });

  getMyGroups = asyncHandler(async (req: Request, res: Response) => {
    const { userId, role } = req.user!;

    const { limit = 10, skip = 0 } = req.query;

    const groups = await this._groupService.getMyGroups(
      userId,
      role,
      Number(limit),
      Number(skip),
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Groups fetched successfully",
      data: groups,
    });
  });
}
