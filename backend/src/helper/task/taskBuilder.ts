import { CreateTaskDTO } from "../../dtos/task/createTask.dto";
import mongoose from "mongoose";

export const buildTaskData = (
  dto: CreateTaskDTO,
  challengeId: string,
  slug: string,
) => {
  return {
    ...dto,
    challengeId: new mongoose.Types.ObjectId(challengeId),
    slug,
  };
};
