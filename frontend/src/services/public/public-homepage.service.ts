
import { clientApi } from "@/lib/axios/clientApi";

import { PUBLIC_HOMEPAGE_ROUTES } from "@/routes/public/public-homepage.routes";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

import { PublicHomeNutritionistDTO } from "@/dtos/public/home/public-home-nutritionist.dto";
import { PublicHomeChallengeDTO } from "@/dtos/public/home/public-home-challenge.dto";
import { PublicHomeCommunityGroupDTO } from "@/dtos/public/home/public-home-community-group.dto";
import { PublicHomeSessionDTO } from "@/dtos/public/home/public-home-session.dto";
import { PublicHomePostDTO } from "@/dtos/public/home/public-home-post.dto";
import { PublicHomeResourceDTO } from "@/dtos/public/home/public-home-resource.dto";
import { PublicHomeTestimonialDTO } from "@/dtos/public/home/public-home-testimonial.dto";

export const publicHomepageService = {
  async getFeaturedNutritionists(): Promise<
    ApiResponseDTO<PublicHomeNutritionistDTO[]>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<PublicHomeNutritionistDTO[]>
    >(PUBLIC_HOMEPAGE_ROUTES.FEATURED_NUTRITIONISTS);

    return response.data;
  },

  async getPopularChallenges(): Promise<
    ApiResponseDTO<PublicHomeChallengeDTO[]>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<PublicHomeChallengeDTO[]>
    >(PUBLIC_HOMEPAGE_ROUTES.POPULAR_CHALLENGES);

    return response.data;
  },

  async getPublicCommunityGroups(): Promise<
    ApiResponseDTO<PublicHomeCommunityGroupDTO[]>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<PublicHomeCommunityGroupDTO[]>
    >(PUBLIC_HOMEPAGE_ROUTES.COMMUNITY_GROUPS);

    return response.data;
  },

  async getUpcomingSessions(): Promise<
    ApiResponseDTO<PublicHomeSessionDTO[]>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<PublicHomeSessionDTO[]>
    >(PUBLIC_HOMEPAGE_ROUTES.UPCOMING_SESSIONS);

    return response.data;
  },

  async getLatestCommunityPosts(): Promise<
    ApiResponseDTO<PublicHomePostDTO[]>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<PublicHomePostDTO[]>
    >(PUBLIC_HOMEPAGE_ROUTES.LATEST_POSTS);

    return response.data;
  },

  async getLatestResources(): Promise<
    ApiResponseDTO<PublicHomeResourceDTO[]>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<PublicHomeResourceDTO[]>
    >(PUBLIC_HOMEPAGE_ROUTES.LATEST_RESOURCES);

    return response.data;
  },

  async getLatestTestimonials(): Promise<
    ApiResponseDTO<PublicHomeTestimonialDTO[]>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<PublicHomeTestimonialDTO[]>
    >(PUBLIC_HOMEPAGE_ROUTES.LATEST_TESTIMONIALS);

    return response.data;
  },
};
