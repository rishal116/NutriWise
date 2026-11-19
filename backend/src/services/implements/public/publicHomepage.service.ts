import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import type { IPublicHomepageService } from "../../interfaces/public/IPublicHomepageService";
import type { IPublicHomepageRepository } from "../../../repositories/interfaces/public/IPublicHomepageRepository";

import logger from "../../../utils/logger";

import type { PublicHomeNutritionist } from "../../../types/public/home/public-home-nutritionist.type";
import type { PublicHomeChallenge } from "../../../types/public/home/public-home-challenge.type";
import type { PublicHomeCommunityGroup } from "../../../types/public/home/public-home-community-group.type";
import type { PublicHomeSession } from "../../../types/public/home/public-home-session.type";
import type { PublicHomePost } from "../../../types/public/home/public-home-post.type";
import type { PublicHomeResource } from "../../../types/public/home/public-home-resource.type";
import type { PublicHomeTestimonial } from "../../../types/public/home/public-home-testimonial.type";

@injectable()
export class PublicHomepageService implements IPublicHomepageService {
  constructor(
    @inject(TYPES.IPublicHomepageRepository)
    private readonly _publicHomepageRepository: IPublicHomepageRepository,
  ) {}

  async getFeaturedNutritionists(): Promise<PublicHomeNutritionist[]> {
    logger.info("Fetching featured nutritionists");

    const nutritionists =
      await this._publicHomepageRepository.findFeaturedNutritionists();

    logger.info("Featured nutritionists fetched successfully", {
      count: nutritionists.length,
    });

    return nutritionists;
  }

  async getPopularChallenges(): Promise<PublicHomeChallenge[]> {
    logger.info("Fetching popular challenges");

    const challenges =
      await this._publicHomepageRepository.findPopularChallenges();

    logger.info("Popular challenges fetched successfully", {
      count: challenges.length,
    });

    return challenges;
  }

  async getPublicCommunityGroups(): Promise<PublicHomeCommunityGroup[]> {
    logger.info("Fetching public community groups");

    const groups =
      await this._publicHomepageRepository.findPublicCommunityGroups();

    logger.info("Public community groups fetched successfully", {
      count: groups.length,
    });

    return groups;
  }

  async getUpcomingSessions(): Promise<PublicHomeSession[]> {
    logger.info("Fetching upcoming sessions");

    const sessions =
      await this._publicHomepageRepository.findUpcomingSessions();

    logger.info("Upcoming sessions fetched successfully", {
      count: sessions.length,
    });

    return sessions;
  }

  async getLatestCommunityPosts(): Promise<PublicHomePost[]> {
    logger.info("Fetching latest community posts");

    const posts =
      await this._publicHomepageRepository.findLatestCommunityPosts();

    logger.info("Latest community posts fetched successfully", {
      count: posts.length,
    });

    return posts;
  }

  async getLatestResources(): Promise<PublicHomeResource[]> {
    logger.info("Fetching latest educational resources");

    const resources =
      await this._publicHomepageRepository.findLatestResources();

    logger.info("Latest educational resources fetched successfully", {
      count: resources.length,
    });

    return resources;
  }

  async getLatestTestimonials(): Promise<PublicHomeTestimonial[]> {
    logger.info("Fetching latest testimonials");

    const testimonials =
      await this._publicHomepageRepository.findLatestTestimonials();

    logger.info("Latest testimonials fetched successfully", {
      count: testimonials.length,
    });

    return testimonials;
  }
}
