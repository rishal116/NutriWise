import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types"; 
import { StatusCode } from "../../../enums/statusCode.enum"; 
import type { IPublicHomepageController } from "../../interfaces/public/IPublicHomepageController";
import type { IPublicHomepageService } from "../../../services/interfaces/public/IPublicHomepageService"; 
import { asyncHandler } from "../../../utils/asyncHandler"; 
import { sendResponse } from "../../../utils/responseHandler"; 
import { PUBLIC_HOMEPAGE_MESSAGES } from "../../../constants/public/home/public-homepage.messages";

@injectable()
export class PublicHomepageController implements IPublicHomepageController {
  constructor(
    @inject(TYPES.IPublicHomepageService)
    private readonly _publicHomepageService: IPublicHomepageService,
  ) {}

  getFeaturedNutritionists = asyncHandler(
    async (_req: Request, res: Response) => {
      const nutritionists =
        await this._publicHomepageService.getFeaturedNutritionists();

      sendResponse(
        res,
        StatusCode.OK,
        PUBLIC_HOMEPAGE_MESSAGES.FEATURED_NUTRITIONISTS_SUCCESS,
        nutritionists,
      );
    },
  );

  getPopularChallenges = asyncHandler(async (_req: Request, res: Response) => {
    const challenges = await this._publicHomepageService.getPopularChallenges();

    sendResponse(
      res,
      StatusCode.OK,
      PUBLIC_HOMEPAGE_MESSAGES.POPULAR_CHALLENGES_SUCCESS,
      challenges,
    );
  });

  getPublicCommunityGroups = asyncHandler(
    async (_req: Request, res: Response) => {
      const groups =
        await this._publicHomepageService.getPublicCommunityGroups();

      sendResponse(
        res,
        StatusCode.OK,
        PUBLIC_HOMEPAGE_MESSAGES.COMMUNITY_GROUPS_SUCCESS,
        groups,
      );
    },
  );

  getUpcomingSessions = asyncHandler(async (_req: Request, res: Response) => {
    const sessions = await this._publicHomepageService.getUpcomingSessions();

    sendResponse(
      res,
      StatusCode.OK,
      PUBLIC_HOMEPAGE_MESSAGES.UPCOMING_SESSIONS_SUCCESS,
      sessions,
    );
  });

  getLatestCommunityPosts = asyncHandler(
    async (_req: Request, res: Response) => {
      const posts = await this._publicHomepageService.getLatestCommunityPosts();

      sendResponse(
        res,
        StatusCode.OK,
        PUBLIC_HOMEPAGE_MESSAGES.LATEST_POSTS_SUCCESS,
        posts,
      );
    },
  );

  getLatestResources = asyncHandler(async (_req: Request, res: Response) => {
    const resources = await this._publicHomepageService.getLatestResources();

    sendResponse(
      res,
      StatusCode.OK,
      PUBLIC_HOMEPAGE_MESSAGES.LATEST_RESOURCES_SUCCESS,
      resources,
    );
  });

  getLatestTestimonials = asyncHandler(async (_req: Request, res: Response) => {
    const testimonials =
      await this._publicHomepageService.getLatestTestimonials();

    sendResponse(
      res,
      StatusCode.OK,
      PUBLIC_HOMEPAGE_MESSAGES.LATEST_TESTIMONIALS_SUCCESS,
      testimonials,
    );
  });
}
