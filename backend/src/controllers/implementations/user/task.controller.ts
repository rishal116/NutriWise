import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { ITaskService } from "../../../services/interfaces/user/ITaskService";
import { ITaskController } from "../../interfaces/user/ITaskController";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

@injectable()
export class TaskController implements ITaskController {
  constructor(
    @inject(TYPES.ITaskService)
    private _taskService: ITaskService,
  ) {}

  getTodayTasks = asyncHandler(async (req: Request, res: Response) => {
    const { programId, dayNumber } = req.query;
    const userId = req.user!.userId;

    const data = await this._taskService.getTodayTasks(
      userId,
      String(programId),
      Number(dayNumber),
    );

    res.status(StatusCode.OK).json({ success: true, data });
  });

  updateTodayTasks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const updatedTask = await this._taskService.updateTodayTasks(
      userId,
      req.body,
    );

    res.status(StatusCode.OK).json({ success: true, data: updatedTask });
  });
}
