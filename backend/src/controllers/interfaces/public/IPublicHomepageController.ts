import type { RequestHandler } from "express";

export interface IPublicHomepageController {
  getFeaturedNutritionists: RequestHandler;
  getPopularChallenges: RequestHandler;
  getPublicCommunityGroups: RequestHandler;
  getUpcomingSessions: RequestHandler;
  getLatestCommunityPosts: RequestHandler;
  getLatestResources: RequestHandler;
  getLatestTestimonials: RequestHandler;
}
