import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IGroupController } from "../../interfaces/chat/IGroupController";
import { IGroupService } from "../../../services/interfaces/chat/IGroupService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class GroupController implements IGroupController {
  constructor(
    @inject(TYPES.IGroupService)
    private readonly _groupService: IGroupService,
  ) {}

  joinPrivateGroup = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._groupService.joinPrivateGroup(
      req.user?.userId as string,
      req.body.inviteToken,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: result.joined
        ? "Successfully joined the group."
        : "You are already a member of this group.",
      data: result,
    });
  });
}
