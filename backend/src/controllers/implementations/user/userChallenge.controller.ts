import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserChallengeController } from "../../interfaces/user/IUserChallengeController";
import { IUserChallengeService } from "../../../services/interfaces/user/IUserChallengeService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ChallengeCategory, ChallengeDifficulty, ChallengeFilters, ChallengeSortBy, ChallengeType } from "../../../dtos/challenge/challenge-filter.dto";

@injectable()
export class UserChallengeController implements IUserChallengeController {
    constructor(
        @inject(TYPES.IUserChallengeService)
        private _challengeService: IUserChallengeService,
    ) { }

    getChallenges = asyncHandler(
        async (req: Request, res: Response, _next: NextFunction) => {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const filters: ChallengeFilters = {
                search: req.query.search as string,
                type: req.query.type as ChallengeType,
                difficulty: req.query.difficulty as ChallengeDifficulty,
                category: req.query.category as ChallengeCategory,
                sortBy: (req.query.sortBy as ChallengeSortBy) || "latest",
            };

            const result = await this._challengeService.getChallenges(
                page,
                limit,
                filters,
            );

            res.status(StatusCode.OK).json({
                success: true,
                data: result.data,
                pagination: {
                    total: result.total,
                    page,
                    limit,
                    totalPages: Math.ceil(result.total / limit),
                },
            });
        },
    );

    getChallengeBySlug = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { slug } = req.params;
            const challenge = await this._challengeService.getChallengeBySlug(slug);

            res.status(StatusCode.OK).json({
                success: true,
                data: challenge,
            });
        },
    );

    getChallengeById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;
            const challenge = await this._challengeService.getChallengeById(id);

            res.status(StatusCode.OK).json({
                success: true,
                data: challenge,
            });
        },
    );

    getFeaturedChallenges = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const challenges = await this._challengeService.getFeaturedChallenges();

            res.status(StatusCode.OK).json({
                success: true,
                data: challenges,
            });
        },
    );

    joinChallenge = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;
            const userId = req.user!.userId
            const enrollment = await this._challengeService.joinChallenge(userId, id);

            res.status(StatusCode.CREATED).json({
                success: true,
                message: "Successfully joined the challenge!",
                data: enrollment,
            });
        },
    );

    getMyChallenges = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const userId = req.user!.userId
            const challenges = await this._challengeService.getMyChallenges(userId);

            res.status(StatusCode.OK).json({
                success: true,
                data: challenges,
            });
        },
    );

    getChallengeTasks = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;
            const dayNumber = req.query.dayNumber ? parseInt(req.query.dayNumber as string) : undefined;
            const userId = req.user!.userId

            const tasks = await this._challengeService.getChallengeTasks(id, dayNumber);

            let progress: any[] = [];
            if (userId) {
                progress = await this._challengeService.getUserTaskProgress(userId, id, dayNumber);
            }

            const tasksWithProgress = tasks.map(task => {
                const taskProgress = progress.find(p => p.taskId.toString() === task.id.toString());
                return {
                    ...task,
                    isCompleted: taskProgress ? taskProgress.completed : false,
                };
            });

            res.status(StatusCode.OK).json({
                success: true,
                data: tasksWithProgress,
            });
        },
    );

    toggleTaskCompletion = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id: challengeId } = req.params;
            const { taskId, dayNumber, completed } = req.body;
            const userId = req.user!.userId

            const result = await this._challengeService.toggleTaskCompletion(
                userId,
                challengeId,
                taskId,
                dayNumber,
                completed
            );

            res.status(StatusCode.OK).json({
                success: true,
                message: completed ? "Task marked as completed!" : "Task marked as incomplete",
                data: result,
            });
        },
    );
}
