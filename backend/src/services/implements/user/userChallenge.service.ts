import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserChallengeService } from "../../interfaces/user/IUserChallengeService";
import { IChallengeRepository } from "../../../repositories/interfaces/challenge/IChallengeRepository";
import { ChallengeFilters } from "../../../dtos/challenge/challenge-filter.dto";
import { ChallengeListDTO } from "../../../dtos/challenge/challenge-list.dto";
import { ChallengeResponseDTO } from "../../../dtos/challenge/challengeResponse.dto";
import { mapChallengeToListDTO } from "../../../mapper/challenge/challenge-list.mapper";
import { mapChallengeToDTO } from "../../../mapper/challenge/challenge.mapper";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IUserChallengeRepository } from "../../../repositories/interfaces/challenge/IUserChallengeRepository";
import { ITaskRepository } from "../../../repositories/interfaces/challenge/ITaskRepository";
import { IUserTaskProgressRepository } from "../../../repositories/interfaces/challenge/IUserTaskProgressRepository";
import { Types } from "mongoose";
import { UserTaskProgressDTO } from "../../../dtos/user/user-task-progress.dto";
import { UserChallengeDTO } from "../../../dtos/user/user-challenge.dto";
import { mapUserChallengeToDTO } from "../../../mapper/challenge/mapUserChallengeToDTO";
import { TaskResponseDTO } from "../../../dtos/task/taskResponse.dto";
import { mapTaskToDTO } from "../../../mapper/task/task.mapper";
import { mapUserTaskProgressToDTO } from "../../../mapper/user/user-task-progress.mapper";

@injectable()
export class UserChallengeService implements IUserChallengeService {
  constructor(
    @inject(TYPES.IChallengeRepository)
    private _challengeRepository: IChallengeRepository,

    @inject(TYPES.IUserChallengeRepository)
    private _userChallengeRepository: IUserChallengeRepository,

    @inject(TYPES.ITaskRepository)
    private _taskRepository: ITaskRepository,

    @inject(TYPES.IUserTaskProgressRepository)
    private _userTaskProgressRepository: IUserTaskProgressRepository,
  ) { }

  async getChallenges(
    page: number,
    limit: number,
    filters: ChallengeFilters,
  ): Promise<{ data: ChallengeListDTO[]; total: number }> {
    // For public users, always filter by published status
    const publicFilters: ChallengeFilters = {
      ...filters,
      status: "published",
    };

    const { data, total } = await this._challengeRepository.findPaginated(
      page,
      limit,
      publicFilters,
      { publicOnly: true }
    );

    return {
      data: data.map(mapChallengeToListDTO),
      total,
    };
  }

  async getChallengeBySlug(slug: string, userId?: string): Promise<ChallengeResponseDTO> {
    const challenge = await this._challengeRepository.findBySlug(slug);

    if (!challenge || challenge.status !== "published" || challenge.isDeleted) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const dto = mapChallengeToDTO(challenge);

    if (userId) {
      const enrollment = await this._userChallengeRepository.findByUserAndChallenge(userId, challenge.id);
      if (enrollment) {
        dto.isEnrolled = true;
        dto.enrollmentId = enrollment._id.toString();
      }
    }

    return dto;
  }

  async getChallengeById(id: string, userId?: string): Promise<ChallengeResponseDTO> {
    const challenge = await this._challengeRepository.findById(id);

    if (!challenge || challenge.status !== "published" || challenge.isDeleted) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const dto = mapChallengeToDTO(challenge);

    if (userId) {
      const enrollment = await this._userChallengeRepository.findByUserAndChallenge(userId, id);
      if (enrollment) {
        dto.isEnrolled = true;
        dto.enrollmentId = enrollment._id.toString();
      }
    }

    return dto;
  }

  async getFeaturedChallenges(): Promise<ChallengeListDTO[]> {
    const challenges = await this._challengeRepository.findFeaturedChallenges();
    return challenges.map(mapChallengeToListDTO);
  }

  async joinChallenge(
    userId: string,
    challengeId: string,
  ): Promise<UserChallengeDTO> {
    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge || challenge.status !== "published") {
      throw new CustomError(
        "Challenge not found or not available",
        StatusCode.NOT_FOUND,
      );
    }

    const existing =
      await this._userChallengeRepository.findByUserAndChallenge(
        userId,
        challengeId,
      );

    if (existing) {
      throw new CustomError(
        "You have already joined this challenge",
        StatusCode.BAD_REQUEST,
      );
    }

    const enrollment = await this._userChallengeRepository.joinChallenge(
      userId,
      challengeId,
    );

    return mapUserChallengeToDTO(enrollment);
  }

  async getMyChallenges(userId: string): Promise<UserChallengeDTO[]> {
    const challenges = await this._userChallengeRepository.findByUser(userId);

    return challenges.map(mapUserChallengeToDTO);
  }
  async getChallengeTasks(
    challengeId: string,
    dayNumber?: number,
  ): Promise<TaskResponseDTO[]> {
    let tasks;

    if (dayNumber) {
      tasks = await this._taskRepository.findByChallengeAndDay(
        challengeId,
        dayNumber,
      );
    } else {
      tasks = await this._taskRepository.findByChallengeId(challengeId);
    }

    return tasks.map(mapTaskToDTO);
  }

  async toggleTaskCompletion(
    userId: string,
    challengeId: string,
    taskId: string,
    dayNumber: number,
    completed: boolean,
  ): Promise<UserTaskProgressDTO> {
    const enrollment =
      await this._userChallengeRepository.findByUserAndChallenge(
        userId,
        challengeId,
      );

    if (!enrollment) {
      throw new CustomError(
        "You are not enrolled in this challenge",
        StatusCode.FORBIDDEN,
      );
    }

    const progress =
      await this._userTaskProgressRepository.upsertTaskProgress({
        userId: new Types.ObjectId(userId),
        challengeId: new Types.ObjectId(challengeId),
        taskId: new Types.ObjectId(taskId),
        dayNumber,
        completed,
        skipped: !completed,
        completedAt: completed ? new Date() : undefined,
      });

    return mapUserTaskProgressToDTO(progress);
  }


  async getUserTaskProgress(
    userId: string,
    challengeId: string,
    dayNumber?: number,
  ): Promise<UserTaskProgressDTO[]> {
    let progressList;

    if (dayNumber) {
      progressList =
        await this._userTaskProgressRepository.findByDay(
          userId,
          challengeId,
          dayNumber,
        );
    } else {
      progressList =
        await this._userTaskProgressRepository.findByUserAndChallenge(
          userId,
          challengeId,
        );
    }

    return progressList.map(mapUserTaskProgressToDTO);
  }
}
