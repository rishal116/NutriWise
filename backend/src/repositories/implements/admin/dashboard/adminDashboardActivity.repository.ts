import { UserModel } from "../../../../models/user.model";
import { NutritionistProfileModel } from "../../../../models/nutritionistProfile.model";
import { PaymentModel } from "../../../../models/payment.model";
import { ChallengeModel } from "../../../../models/challenge.model";

import type {
  AdminDashboardAttentionItem,
  AdminDashboardActivityItem,
} from "../../../../types/admin/dashboard/admin-dashboard.types";

export async function getAttentionItems(): Promise<AdminDashboardAttentionItem[]> {
  const [pendingApplications, draftChallenges, failedPayments, blockedUsers] =
    await Promise.all([
      NutritionistProfileModel.countDocuments({
        applicationStatus: "pending",
      }),
      ChallengeModel.countDocuments({ status: "draft" }),
      PaymentModel.countDocuments({ status: "failed" }),
      UserModel.countDocuments({ isBlocked: true, deletedAt: null }),
    ]);

  const items: AdminDashboardAttentionItem[] = [];

  if (pendingApplications > 0) {
    items.push({
      type: "nutritionist_application",
      title: "Nutritionist applications waiting for review",
      count: pendingApplications,
      action: "Review",
    });
  }

  if (draftChallenges > 0) {
    items.push({
      type: "challenge",
      title: "Challenges are still in draft",
      count: draftChallenges,
      action: "Manage",
    });
  }

  if (failedPayments > 0) {
    items.push({
      type: "payment",
      title: "Failed payments require attention",
      count: failedPayments,
      action: "View",
    });
  }

  if (blockedUsers > 0) {
    items.push({
      type: "user",
      title: "Blocked user accounts",
      count: blockedUsers,
      action: "View",
    });
  }

  return items;
}

export async function getRecentActivity(): Promise<AdminDashboardActivityItem[]> {
  const [users, applications, approvedNutritionists, challenges, purchases] =
    await Promise.all([
      UserModel.find({ deletedAt: null })
        .sort({ createdAt: -1 })
        .limit(5)
        .select({ fullName: 1, createdAt: 1 })
        .lean(),

      NutritionistProfileModel.find({ applicationStatus: "pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select({ createdAt: 1 })
        .lean(),

      NutritionistProfileModel.find({ applicationStatus: "approved" })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select({ updatedAt: 1 })
        .lean(),

      ChallengeModel.find({ status: "published" })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select({ title: 1, updatedAt: 1 })
        .lean(),

      PaymentModel.find({
        resourceType: "nutritionist_plan",
        status: "paid",
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select({ createdAt: 1, itemSnapshot: 1 })
        .lean(),
    ]);

  const activities: AdminDashboardActivityItem[] = [
    ...users.map((user) => ({
      type: "user_registered" as const,
      title: `${user.fullName} registered`,
      createdAt: user.createdAt,
    })),

    ...applications.map((application) => ({
      type: "nutritionist_application" as const,
      title: "New nutritionist application received",
      createdAt: application.createdAt,
    })),

    ...approvedNutritionists.map((nutritionist) => ({
      type: "nutritionist_approved" as const,
      title: "Nutritionist application approved",
      createdAt: nutritionist.updatedAt,
    })),

    ...challenges.map((challenge) => ({
      type: "challenge_published" as const,
      title: `${challenge.title} published`,
      createdAt: challenge.updatedAt,
    })),

    ...purchases.map((purchase) => ({
      type: "purchase_completed" as const,
      title: `${purchase.itemSnapshot.title} purchased`,
      createdAt: purchase.createdAt,
    })),
  ];

  return activities
    .sort((first, second) =>
      second.createdAt.getTime() - first.createdAt.getTime(),
    )
    .slice(0, 8);
}