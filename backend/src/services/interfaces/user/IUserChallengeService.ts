import { ChallengeFilters } from "../../../dtos/challenge/challenge-filter.dto";
import { ChallengeListDTO } from "../../../dtos/challenge/challenge-list.dto";
import { ChallengeResponseDTO } from "../../../dtos/challenge/challengeResponse.dto";
import { UserChallengeDTO } from "../../../dtos/user/user-challenge.dto";
import { UserTaskProgressDTO } from "../../../dtos/user/user-task-progress.dto";
import { TaskResponseDTO } from "../../../dtos/task/taskResponse.dto";

export interface IUserChallengeService {
  getChallenges(
    page: number,
    limit: number,
    filters: ChallengeFilters,
  ): Promise<{
    data: ChallengeListDTO[];
    total: number;
  }>;
  getChallengeBySlug(slug: string, userId?: string): Promise<ChallengeResponseDTO>;
  getChallengeById(id: string, userId?: string): Promise<ChallengeResponseDTO>;
  getFeaturedChallenges(): Promise<ChallengeListDTO[]>;
  joinChallenge(userId: string, challengeId: string): Promise<UserChallengeDTO>;
  getMyChallenges(userId: string): Promise<UserChallengeDTO[]>;
  getChallengeTasks(challengeId: string, dayNumber?: number): Promise<TaskResponseDTO[]>;
  toggleTaskCompletion(
    userId: string,
    challengeId: string,
    taskId: string,
    dayNumber: number,
    completed: boolean,
  ): Promise<UserTaskProgressDTO>;
  getUserTaskProgress(
    userId: string,
    challengeId: string,
    dayNumber?: number,
  ): Promise<UserTaskProgressDTO[]>;
}
