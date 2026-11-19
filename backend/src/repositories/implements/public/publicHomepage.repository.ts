import { injectable } from "inversify";

import { ChallengeModel } from "../../../models/challenge.model";
import { UserChallengeModel } from "../../../models/userChallenge.model";
import { NutritionistProfileModel } from "../../../models/nutritionistProfile.model";
import { UserModel } from "../../../models/user.model";
import { ConversationModel } from "../../../models/conversation.model";
import { ConversationMemberModel } from "../../../models/conversationMember.model";
import { SessionModel } from "../../../models/session.model";
import { PostModel } from "../../../models/post.model";
import { ResourceModel } from "../../../models/resource.model";
import { Review } from "../../../models/review.model";

import type { IPublicHomepageRepository } from "../../interfaces/public/IPublicHomepageRepository";

import type { PublicHomeNutritionist } from "../../../types/public/home/public-home-nutritionist.type";
import type { PublicHomeChallenge } from "../../../types/public/home/public-home-challenge.type";
import type { PublicHomeCommunityGroup } from "../../../types/public/home/public-home-community-group.type";
import type { PublicHomeSession } from "../../../types/public/home/public-home-session.type";
import type { PublicHomePost } from "../../../types/public/home/public-home-post.type";
import type { PublicHomeResource } from "../../../types/public/home/public-home-resource.type";
import type { PublicHomeTestimonial } from "../../../types/public/home/public-home-testimonial.type";

@injectable()
export class PublicHomepageRepository implements IPublicHomepageRepository {
  private readonly _sectionLimit = 6;

  async findFeaturedNutritionists(): Promise<PublicHomeNutritionist[]> {
    return NutritionistProfileModel.aggregate<PublicHomeNutritionist>([
      {
        $match: {
          applicationStatus: "approved",
        },
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.roles": "nutritionist",
          "user.isBlocked": { $ne: true },
          "user.deletedAt": null,
        },
      },
      {
        $sort: {
          rating: -1,
          totalReviews: -1,
          _id: -1,
        },
      },
      {
        $limit: this._sectionLimit,
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$user._id" },
          fullName: "$user.fullName",
          username: "$user.username",
          profileImage: "$user.profileImage",
          bio: 1,
          qualifications: 1,
          specializations: 1,
          coachLevel: 1,
          rating: 1,
          totalReviews: 1,
          totalPeopleCoached: 1,
        },
      },
    ]);
  }

  async findPopularChallenges(): Promise<PublicHomeChallenge[]> {
    return UserChallengeModel.aggregate<PublicHomeChallenge>([
      {
        $group: {
          _id: "$challengeId",
          participantCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: ChallengeModel.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "challenge",
        },
      },
      {
        $unwind: "$challenge",
      },
      {
        $match: {
          "challenge.status": "published",
        },
      },
      {
        $sort: {
          participantCount: -1,
          _id: -1,
        },
      },
      {
        $limit: this._sectionLimit,
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$challenge._id" },
          title: "$challenge.title",
          description: "$challenge.description",
          thumbnailUrl: "$challenge.thumbnailUrl",
          category: "$challenge.category",
          difficulty: "$challenge.difficulty",
          accessType: "$challenge.accessType",
          durationDays: "$challenge.durationDays",
        },
      },
    ]);
  }

  async findPublicCommunityGroups(): Promise<PublicHomeCommunityGroup[]> {
    return ConversationModel.aggregate<PublicHomeCommunityGroup>([
      {
        $match: {
          chatType: "group",
          visibility: "public",
          purpose: "group_coaching",
          status: "active",
        },
      },
      {
        $lookup: {
          from: ConversationMemberModel.collection.name,
          let: {
            conversationId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$conversationId", "$$conversationId"],
                },
                status: "active",
              },
            },
            {
              $count: "count",
            },
          ],
          as: "memberCountResult",
        },
      },
      {
        $addFields: {
          memberCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$memberCountResult.count", 0],
              },
              0,
            ],
          },
        },
      },
      {
        $sort: {
          memberCount: -1,
          createdAt: -1,
        },
      },
      {
        $limit: this._sectionLimit,
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          title: 1,
          description: 1,
          groupAvatar: 1,
          memberCount: 1,
          createdAt: 1,
        },
      },
    ]);
  }

  async findUpcomingSessions(): Promise<PublicHomeSession[]> {
    const currentDate = new Date();

    return SessionModel.aggregate<PublicHomeSession>([
      {
        $match: {
          status: "scheduled",
          scheduledAt: { $gt: currentDate },
        },
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "nutritionistId",
          foreignField: "_id",
          as: "nutritionist",
        },
      },
      {
        $unwind: "$nutritionist",
      },
      {
        $match: {
          "nutritionist.roles": "nutritionist",
          "nutritionist.isBlocked": { $ne: true },
          "nutritionist.deletedAt": null,
        },
      },
      {
        $lookup: {
          from: NutritionistProfileModel.collection.name,
          let: {
            nutritionistId: "$nutritionistId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$nutritionistId"],
                },
                applicationStatus: "approved",
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "nutritionistProfile",
        },
      },
      {
        $match: {
          "nutritionistProfile.0": { $exists: true },
        },
      },
      {
        $sort: {
          scheduledAt: 1,
          _id: 1,
        },
      },
      {
        $limit: this._sectionLimit,
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          title: 1,
          description: 1,
          type: 1,
          thumbnailUrl: 1,
          scheduledAt: 1,
          durationInMinutes: 1,
          maxParticipants: 1,
          pricing: 1,
          nutritionist: {
            fullName: "$nutritionist.fullName",
            username: "$nutritionist.username",
            profileImage: "$nutritionist.profileImage",
          },
        },
      },
    ]);
  }

  async findLatestCommunityPosts(): Promise<PublicHomePost[]> {
    return PostModel.aggregate<PublicHomePost>([
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $match: {
          "author.isBlocked": { $ne: true },
          "author.deletedAt": null,
        },
      },
      {
        $sort: {
          createdAt: -1,
          _id: -1,
        },
      },
      {
        $limit: this._sectionLimit,
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          content: 1,
          media: 1,
          viewCount: 1,
          likeCount: 1,
          commentCount: 1,
          createdAt: 1,
          author: {
            fullName: "$author.fullName",
            username: "$author.username",
            profileImage: "$author.profileImage",
          },
        },
      },
    ]);
  }

  async findLatestResources(): Promise<PublicHomeResource[]> {
    return ResourceModel.aggregate<PublicHomeResource>([
      {
        $match: {
          status: "published",
        },
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "createdBy",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $match: {
          "author.isBlocked": { $ne: true },
          "author.deletedAt": null,
        },
      },
      {
        $sort: {
          publishedAt: -1,
          _id: -1,
        },
      },
      {
        $limit: this._sectionLimit,
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          title: 1,
          description: 1,
          type: 1,
          category: 1,
          fileUrl: 1,
          publishedAt: 1,
          viewCount: 1,
          likeCount: 1,
          commentCount: 1,
          createdAt: 1,
          author: {
            fullName: "$author.fullName",
            username: "$author.username",
            profileImage: "$author.profileImage",
          },
        },
      },
    ]);
  }

  async findLatestTestimonials(): Promise<PublicHomeTestimonial[]> {
    return Review.aggregate<PublicHomeTestimonial>([
      {
        $match: {
          isDeleted: false,
          review: { $exists: true, $ne: "" },
        },
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "nutritionist",
          foreignField: "_id",
          as: "nutritionist",
        },
      },
      {
        $unwind: "$nutritionist",
      },
      {
        $match: {
          "user.isBlocked": { $ne: true },
          "user.deletedAt": null,
          "nutritionist.isBlocked": { $ne: true },
          "nutritionist.deletedAt": null,
          "nutritionist.roles": "nutritionist",
        },
      },
      {
        $sort: {
          createdAt: -1,
          _id: -1,
        },
      },
      {
        $limit: this._sectionLimit,
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          rating: 1,
          review: 1,
          createdAt: 1,
          user: {
            fullName: "$user.fullName",
            username: "$user.username",
            profileImage: "$user.profileImage",
          },
          nutritionist: {
            fullName: "$nutritionist.fullName",
            username: "$nutritionist.username",
            profileImage: "$nutritionist.profileImage",
          },
        },
      },
    ]);
  }
}
