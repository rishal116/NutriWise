import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { INutriGroupController } from "../../interfaces/nutritionist/INutriGroupController";
import { INutriGroupService } from "../../../services/interfaces/nutritionist/INutriGroupService";

import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class NutriGroupController implements INutriGroupController {
  constructor(
    @inject(TYPES.INutriGroupService)
    private readonly _groupService: INutriGroupService,
  ) {}

  createGroup = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const nutritionistId = req.user!.userId;

      const group = await this._groupService.createGroup(
        nutritionistId,
        req.body,
      );

      res.status(StatusCode.CREATED).json({
        success: true,
        message: "Group created successfully",
        data: group,
      });
    },
  );

  browseGroups = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const nutritionistId = req.user!.userId;

      const groups = await this._groupService.browseGroups(
        nutritionistId,
        req.query,
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Groups fetched successfully",
        data: groups,
      });
    },
  );

  getGroup = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const nutritionistId = req.user!.userId;
      const { groupId } = req.params;

      const group = await this._groupService.getGroup(nutritionistId, groupId);

      res.status(StatusCode.OK).json({
        success: true,
        message: "Group fetched successfully",
        data: group,
      });
    },
  );
}
