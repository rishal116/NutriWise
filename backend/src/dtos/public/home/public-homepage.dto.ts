import type { PublicHomeNutritionist } from "../../../types/public/home/public-home-nutritionist.type";
import type { PublicHomeChallenge } from "../../../types/public/home/public-home-challenge.type";
import type { PublicHomeCommunityGroup } from "../../../types/public/home/public-home-community-group.type";
import type { PublicHomeSession } from "../../../types/public/home/public-home-session.type";
import type { PublicHomePost } from "../../../types/public/home/public-home-post.type";
import type { PublicHomeResource } from "../../../types/public/home/public-home-resource.type";
import type { PublicHomeTestimonial } from "../../../types/public/home/public-home-testimonial.type";

export class PublicHomepageDTO {
  nutritionists: PublicHomeNutritionist[];
  challenges: PublicHomeChallenge[];
  communityGroups: PublicHomeCommunityGroup[];
  upcomingSessions: PublicHomeSession[];
  latestPosts: PublicHomePost[];
  latestResources: PublicHomeResource[];
  testimonials: PublicHomeTestimonial[];

  constructor(data: PublicHomepageDTO) {
    this.nutritionists = data.nutritionists;
    this.challenges = data.challenges;
    this.communityGroups = data.communityGroups;
    this.upcomingSessions = data.upcomingSessions;
    this.latestPosts = data.latestPosts;
    this.latestResources = data.latestResources;
    this.testimonials = data.testimonials;
  }
}