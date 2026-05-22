import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IAdminTaskController } from "../../interfaces/admin/IAdminTaskController";
import { IAdminTaskService } from "../../../services/interfaces/admin/IAdminTaskService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

type TaskUploadFiles = {
  coverImage?: Express.Multer.File[];
  mediaFiles?: Express.Multer.File[];
  instructionMediaFiles?: Express.Multer.File[];
};

@injectable()
export class AdminTaskController implements IAdminTaskController {
  constructor(
    @inject(TYPES.IAdminTaskService)
    private _adminTaskService: IAdminTaskService,
  ) {}

  createTask = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    const files = req.files as TaskUploadFiles | undefined;

    const task = await this._adminTaskService.createTask(
      challengeId,
      req.body,
      files,
    );

    res.status(StatusCode.CREATED).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  });

  getTasksByChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    const tasks = await this._adminTaskService.getTasksByChallenge(
      challengeId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: tasks,
    });
  });

  getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params;

    const task = await this._adminTaskService.getTaskById(taskId);

    res.status(StatusCode.OK).json({
      success: true,
      data: task,
    });
  });

  updateTask = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params;

    const files = req.files as TaskUploadFiles | undefined;

    const updated = await this._adminTaskService.updateTask(
      taskId,
      req.body,
      files,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Task updated successfully",
      data: updated,
    });
  });

  deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params;

    await this._adminTaskService.deleteTask(taskId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Task deleted successfully",
    });
  });
}