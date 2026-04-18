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
    private readonly _groupService: INutriGroupService,
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
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = Number(req.query.skip) || 0;
    const groups = await this._groupService.getMyGroups(
      userId,
      role,
      limit,
      skip,
    );
    return res.status(StatusCode.OK).json({
      success: true,
      message: "Groups fetched successfully",
      data: groups,
    });
  });

  getGroup = asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const data = await this._groupService.getGroupDetails(groupId);
    return res.status(StatusCode.OK).json({
      success: true,
      data,
    });
  });

  getJoinRequests = asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const data = await this._groupService.getJoinRequests(groupId);
    return res.status(StatusCode.OK).json({
      success: true,
      data,
    });
  });

  acceptRequest = asyncHandler(async (req: Request, res: Response) => {
    const { groupId, userId } = req.params;
    await this._groupService.acceptRequest(groupId, userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: "User accepted successfully",
    });
  });

  rejectRequest = asyncHandler(async (req: Request, res: Response) => {
    const { groupId, userId } = req.params;
    await this._groupService.rejectRequest(groupId, userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: "User rejected successfully",
    });
  });
  
}