import { CreateTaskDTO } from "../../dtos/task/createTask.dto";
import { UpdateTaskDTO } from "../../dtos/task/updateTask.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";

export function validateTaskDto(dto: CreateTaskDTO): void {
  if (!dto.title?.trim()) {
    throw new CustomError("Task title is required", StatusCode.BAD_REQUEST);
  }

  if (!dto.dayNumber || dto.dayNumber < 1) {
    throw new CustomError(
      "Valid day number is required",
      StatusCode.BAD_REQUEST,
    );
  }

  if (!dto.type) {
    throw new CustomError("Task type is required", StatusCode.BAD_REQUEST);
  }

  if (
    dto.minimumValue &&
    dto.maximumValue &&
    dto.minimumValue > dto.maximumValue
  ) {
    throw new CustomError(
      "Minimum value cannot exceed maximum value",
      StatusCode.BAD_REQUEST,
    );
  }
}

export const validateUpdateTaskDto = (dto: UpdateTaskDTO): void => {
  if (dto.title !== undefined) {
    if (!dto.title.trim()) {
      throw new CustomError(
        "Task title cannot be empty",
        StatusCode.BAD_REQUEST,
      );
    }

    if (dto.title.length > 150) {
      throw new CustomError(
        "Task title exceeds maximum length",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  if (dto.dayNumber !== undefined && dto.dayNumber < 1) {
    throw new CustomError(
      "Day number must be at least 1",
      StatusCode.BAD_REQUEST,
    );
  }

  if (dto.order !== undefined && dto.order < 1) {
    throw new CustomError("Order must be at least 1", StatusCode.BAD_REQUEST);
  }

  if (dto.targetValue !== undefined && dto.targetValue < 0) {
    throw new CustomError(
      "Target value cannot be negative",
      StatusCode.BAD_REQUEST,
    );
  }

  if (
    dto.minimumValue !== undefined &&
    dto.maximumValue !== undefined &&
    dto.minimumValue > dto.maximumValue
  ) {
    throw new CustomError(
      "Minimum value cannot exceed maximum value",
      StatusCode.BAD_REQUEST,
    );
  }

  if (
    dto.estimatedDurationMinutes !== undefined &&
    dto.estimatedDurationMinutes < 1
  ) {
    throw new CustomError(
      "Estimated duration must be at least 1 minute",
      StatusCode.BAD_REQUEST,
    );
  }
};
