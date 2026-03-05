import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { ITaskService } from "../../../services/interfaces/user/ITaskService";
import { ITaskController } from "../../interfaces/user/ITaskController";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class TaskController implements ITaskController{
    constructor(
        @inject(TYPES.ITaskService)
        private _taskService: ITaskService
    ) {}
    
    getTodayTasks = async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const task = await this._taskService.getTodayTasks(userId);
        res.status(StatusCode.OK).json({success: true,data:task});
    };
    
    updateTodayTasks = async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const updatedTask = await this._taskService.updateTodayTasks(userId, req.body);
        res.status(StatusCode.OK).json({success: true,message: "Tasks updated"});
    };
}