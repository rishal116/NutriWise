import { CreateTaskDTO } from "../../dtos/task/createTask.dto";

export function normalizeTaskDto(dto: CreateTaskDTO): void {
  dto.title = dto.title.trim();

  if (dto.shortDescription) {
    dto.shortDescription = dto.shortDescription.trim();
  }

  if (dto.description) {
    dto.description = dto.description.trim();
  }

  // Handle FormData strings
  if (typeof (dto as any).mediaMetadata === "string") {
    dto.media = JSON.parse((dto as any).mediaMetadata);
  }
  if (typeof (dto as any).instructionSteps === "string") {
    dto.instructionSteps = JSON.parse((dto as any).instructionSteps);
  }
  if (typeof (dto as any).aiTips === "string") {
    dto.aiTips = JSON.parse((dto as any).aiTips);
  }
  if (typeof (dto as any).safetyWarnings === "string") {
    dto.safetyWarnings = JSON.parse((dto as any).safetyWarnings);
  }

  // Numbers
  dto.dayNumber = Number(dto.dayNumber);
  dto.order = Number(dto.order) || 1;
  if (dto.targetValue !== undefined) dto.targetValue = Number(dto.targetValue);
  if (dto.estimatedDurationMinutes !== undefined)
    dto.estimatedDurationMinutes = Number(dto.estimatedDurationMinutes);

  // Booleans
  if (typeof (dto as any).isOptional === "string") {
    dto.isOptional = (dto as any).isOptional === "true";
  }
  if (typeof (dto as any).isLocked === "string") {
    dto.isLocked = (dto as any).isLocked === "true";
  }
}

