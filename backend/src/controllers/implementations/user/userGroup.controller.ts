import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserGroupController } from "../../interfaces/user/IUserGroupController";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { IUserGroupService } from "../../../services/interfaces/user/IUserGroupService";

@injectable()
export class UserGroupController implements IUserGroupController {
  constructor(
    @inject(TYPES.IUserGroupService)
    private _userGroupService: IUserGroupService,
  ) {}

  getGroups = asyncHandler(async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;
    const skip = Number(req.query.skip) || 0;
    const { userId } = req.user!;

    const data = await this._userGroupService.getGroups(userId, limit, skip);

    return res.status(StatusCode.OK).json({
      success: true,
      ...data,
    });
  });

  joinGroup = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const groupId = req.params.id;

    const result = await this._userGroupService.joinGroup(userId, groupId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  });
}
