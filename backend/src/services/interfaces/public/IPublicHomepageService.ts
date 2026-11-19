
import type { PublicHomeNutritionist } from "../../../types/public/home/public-home-nutritionist.type";
import type { PublicHomeChallenge } from "../../../types/public/home/public-home-challenge.type";
import type { PublicHomeCommunityGroup } from "../../../types/public/home/public-home-community-group.type";
import type { PublicHomeSession } from "../../../types/public/home/public-home-session.type";
import type { PublicHomePost } from "../../../types/public/home/public-home-post.type";
import type { PublicHomeResource } from "../../../types/public/home/public-home-resource.type";
import type { PublicHomeTestimonial } from "../../../types/public/home/public-home-testimonial.type";

export interface IPublicHomepageService {
  getFeaturedNutritionists(): Promise<PublicHomeNutritionist[]>;
  getPopularChallenges(): Promise<PublicHomeChallenge[]>;
  getPublicCommunityGroups(): Promise<PublicHomeCommunityGroup[]>;
  getUpcomingSessions(): Promise<PublicHomeSession[]>;
  getLatestCommunityPosts(): Promise<PublicHomePost[]>;
  getLatestResources(): Promise<PublicHomeResource[]>;
  getLatestTestimonials(): Promise<PublicHomeTestimonial[]>;
}
