import { adminApi } from "@/lib/axios/adminApi";
import {
  IChallengeTask,
  CreateChallengeTaskDTO,
  UpdateChallengeTaskDTO,
  ChallengeTaskListDTO,
  ChallengeTaskResponseDTO,
} from "@/types/task";

export const adminTaskService = {
  createTask: async (challengeId: string, data: FormData) => {
    const res = await adminApi.post(
      `/admin/challenges/${challengeId}/tasks`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return res.data;
  },

  getTasksByChallenge: async (
    challengeId: string,
  ): Promise<{
    success: boolean;
    data: ChallengeTaskListDTO[];
  }> => {
    const res = await adminApi.get(`/admin/challenges/${challengeId}/tasks`);

    return res.data;
  },

  getTaskById: async (
    taskId: string,
  ): Promise<{
    success: boolean;
    data: ChallengeTaskResponseDTO;
  }> => {
    const res = await adminApi.get(`/admin/tasks/${taskId}`);

    return res.data;
  },

  updateTask: async (
    taskId: string,
    data: FormData,
  ): Promise<{
    success: boolean;
    data: ChallengeTaskResponseDTO;
    message: string;
  }> => {
    const res = await adminApi.put(`/admin/tasks/${taskId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  deleteTask: async (
    taskId: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    const res = await adminApi.delete(`/admin/tasks/${taskId}`);

    return res.data;
  },
};
