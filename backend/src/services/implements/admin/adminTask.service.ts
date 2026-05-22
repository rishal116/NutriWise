import { injectable, inject } from "inversify";
import mongoose from "mongoose";
import { TYPES } from "../../../types/types";
import { IAdminTaskService } from "../../interfaces/admin/IAdminTaskService";
import { IChallengeRepository } from "../../../repositories/interfaces/challenge/IChallengeRepository";
import { ITaskRepository } from "../../../repositories/interfaces/challenge/ITaskRepository";
import { CreateTaskDTO } from "../../../dtos/task/createTask.dto";
import { UpdateTaskDTO } from "../../../dtos/task/updateTask.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ITask } from "../../../models/task.model";
import logger from "../../../utils/logger";
import { normalizeTaskDto } from "../../../helper/task/taskNormalizer";
import {
  validateTaskDto,
  validateUpdateTaskDto,
} from "../../../helper/task/taskValidator";
import { buildTaskData } from "../../../helper/task/taskBuilder";
import { TaskResponseDTO } from "../../../dtos/task/taskResponse.dto";
import { TaskListDTO } from "../../../dtos/task/taskList.dto";
import { mapTaskToListDTO } from "../../../mapper/task/task-list.mapper";
import { mapTaskToDTO } from "../../../mapper/task/task.mapper";
import {
  uploadToCloudinary,
} from "../../../utils/cloudinaryUploads";
import slugify from "slugify";

@injectable()
export class AdminTaskService implements IAdminTaskService {
  constructor(
    @inject(TYPES.IChallengeRepository)
    private _challengeRepository: IChallengeRepository,

    @inject(TYPES.ITaskRepository)
    private _taskRepository: ITaskRepository,
  ) {}

  async createTask(
    challengeId: string,
    dto: CreateTaskDTO,
    files?: {
      coverImage?: Express.Multer.File[];
      mediaFiles?: Express.Multer.File[];
      instructionMediaFiles?: Express.Multer.File[];
    },
  ): Promise<ITask> {
    logger.info("Create task started", {
      challengeId,
      title: dto.title,
      action: "CREATE_TASK_START",
    });

    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    normalizeTaskDto(dto);

    const slug =
      slugify(dto.title, {
        lower: true,
        strict: true,
        trim: true,
      }) + `-${dto.dayNumber}-${dto.order || 1}`;

    const existingSlug = await this._taskRepository.findOne({
      challengeId,
      slug,
    });

    if (existingSlug) {
      throw new CustomError(
        "Task with this title already exists in this challenge",
        StatusCode.BAD_REQUEST,
      );
    }

    const existingOrder = await this._taskRepository.findOne({
      challengeId,
      dayNumber: dto.dayNumber,
      order: dto.order || 1,
    });

    if (existingOrder) {
      throw new CustomError(
        `Task already exists for Day ${dto.dayNumber}, Order ${dto.order || 1}`,
        StatusCode.BAD_REQUEST,
      );
    }

    if (files?.coverImage?.[0]) {
      dto.coverImage = await uploadToCloudinary(
        files.coverImage[0],
        "nutriwise/tasks/covers",
      );
    }

    if (files?.mediaFiles?.length && dto.media?.length) {
      let fileIndex = 0;
      for (const m of dto.media) {
        if (
          m.url &&
          !m.url.startsWith("blob:") &&
          !m.url.includes("localhost")
        ) {
          continue;
        }

        if (fileIndex < files.mediaFiles.length) {
          m.url = await uploadToCloudinary(
            files.mediaFiles[fileIndex],
            "nutriwise/tasks/media",
          );
          fileIndex++;
        }
      }
    }



    if (files?.instructionMediaFiles?.length && dto.instructionSteps) {
      let fileIndex = 0;

      for (const step of dto.instructionSteps) {
        if (!step.media?.length) continue;

        for (let i = 0; i < step.media.length; i++) {
          const m = step.media[i];
          // If the URL is already a remote one (not blob/localhost), skip it
          if (
            m.url &&
            !m.url.startsWith("blob:") &&
            !m.url.includes("localhost")
          ) {
            continue;
          }

          const file = files.instructionMediaFiles[fileIndex];
          if (!file) continue;

          step.media[i].url = await uploadToCloudinary(
            file,
            "nutriwise/tasks/instruction-media",
          );

          fileIndex++;
        }
      }
    }


    validateTaskDto(dto);

     const taskData = buildTaskData(dto, challengeId, slug);

    const task = await this._taskRepository.create(taskData);

    logger.info("Task creation successful", {
      taskId: task._id.toString(),
      challengeId,
      action: "CREATE_TASK_SUCCESS",
    });

    return task;
  }

  async getTasksByChallenge(challengeId: string): Promise<TaskListDTO[]> {
    logger.info("Fetching tasks by challenge", {
      challengeId,
      action: "GET_TASKS_BY_CHALLENGE",
    });

    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const tasks = await this._taskRepository.findByChallengeId(challengeId);

    return tasks.map(mapTaskToListDTO);
  }

  async getTaskById(taskId: string): Promise<TaskResponseDTO> {
    logger.info("Fetching task by ID", {
      taskId,
      action: "GET_TASK_BY_ID",
    });

    const task = await this._taskRepository.findById(taskId);

    if (!task) {
      throw new CustomError("Task not found", StatusCode.NOT_FOUND);
    }

    return mapTaskToDTO(task);
  }

  async updateTask(
    taskId: string,
    dto: UpdateTaskDTO,
    files?: {
      coverImage?: Express.Multer.File[];
      mediaFiles?: Express.Multer.File[];
      instructionMediaFiles?: Express.Multer.File[];
    },
  ): Promise<TaskResponseDTO> {
    const session = await mongoose.startSession();
    const uploadedUrls: string[] = [];

    try {
      session.startTransaction();

      logger.info("Updating task", {
        taskId,
        updates: Object.keys(dto),
        action: "UPDATE_TASK",
      });

      const existingTask = await this._taskRepository.findById(taskId);

      if (!existingTask) {
        throw new CustomError("Task not found", StatusCode.NOT_FOUND);
      }

      /* Cover Image Upload */
      if (files?.coverImage?.[0]) {
        const coverUrl = await uploadToCloudinary(
          files.coverImage[0],
          "nutriwise/tasks/covers",
        );

        dto.coverImage = coverUrl;
        uploadedUrls.push(coverUrl);
      }

      /* Main Media Upload */
      if (files?.mediaFiles?.length && dto.media?.length) {
        let fileIndex = 0;
        for (const m of dto.media) {
          if (fileIndex < files.mediaFiles.length) {
            const uploadedUrl = await uploadToCloudinary(
              files.mediaFiles[fileIndex],
              "nutriwise/tasks/media",
            );
            m.url = uploadedUrl;
            uploadedUrls.push(uploadedUrl);
            fileIndex++;
          }
        }
      }


      /* Instruction Step Media Upload */
      if (files?.instructionMediaFiles?.length && dto.instructionSteps) {
        let fileIndex = 0;

        for (const step of dto.instructionSteps) {
          if (!step.media?.length) continue;

          for (let i = 0; i < step.media.length; i++) {
            const file = files.instructionMediaFiles[fileIndex];

            if (!file) continue;

            const uploadedUrl = await uploadToCloudinary(
              file,
              "nutriwise/tasks/instruction-media",
            );

            uploadedUrls.push(uploadedUrl);
            step.media[i].url = uploadedUrl;

            fileIndex++;
          }
        }
      }

      const parseJsonField = <T>(field: T | string | undefined): T | undefined => {
  if (typeof field === "string") {
    return JSON.parse(field) as T;
  }
  return field;
};

dto.media = parseJsonField(dto.media);
dto.instructionSteps = parseJsonField(dto.instructionSteps);
dto.aiTips = parseJsonField(dto.aiTips);
dto.safetyWarnings = parseJsonField(dto.safetyWarnings);

      /* Validation */
      validateUpdateTaskDto(dto);

      /* Update */
      const updatedTask = await this._taskRepository.updateById(
        taskId,
        dto,
        session,
      );

      if (!updatedTask) {
        throw new CustomError(
          "Task update failed",
          StatusCode.INTERNAL_SERVER_ERROR,
        );
      }

      await session.commitTransaction();

      logger.info("Task update successful", {
        taskId,
        action: "UPDATE_TASK_SUCCESS",
      });

      return mapTaskToDTO(updatedTask);
    } catch (err) {
      await session.abortTransaction();

      logger.error("Task update failed", {
        taskId,
        error: (err as Error).message,
        stack: err instanceof Error ? err.stack : undefined,
        action: "UPDATE_TASK_FAILED",
      });

      // Optional Cloudinary cleanup here if DB fails

      if (err instanceof CustomError) {
        throw err;
      }

      throw new CustomError(
        "Failed to update task",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    logger.warn("Soft deleting task", {
      taskId,
      action: "DELETE_TASK",
    });

    const task = await this._taskRepository.findById(taskId);

    if (!task) {
      throw new CustomError("Task not found", StatusCode.NOT_FOUND);
    }

    await this._taskRepository.softDelete(taskId);

  }
}
