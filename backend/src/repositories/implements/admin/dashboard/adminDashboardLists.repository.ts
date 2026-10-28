import { UserModel } from "../../../../models/user.model";
import { NutritionistProfileModel } from "../../../../models/nutritionistProfile.model";
import { PaymentModel } from "../../../../models/payment.model";

import type {
  AdminDashboardRecentUser,
  AdminDashboardPendingNutritionist,
  AdminDashboardRecentPayment,
} from "../../../../types/admin/dashboard/admin-dashboard.types";

interface PendingNutritionistResult {
  _id: unknown;
  userId: unknown;
  fullName: string;
  email: string;
  applicationStatus: "pending";
  createdAt: Date;
}

interface RecentPaymentResult {
  _id: unknown;
  userId: unknown;
  customerName: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: Date;
}

function normalizeLimit(limit: number): number {
  return Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 1;
}

export async function getRecentUsers(
  limit: number,
): Promise<AdminDashboardRecentUser[]> {
  const users = await UserModel.find({ deletedAt: null })
    .sort({ createdAt: -1, _id: -1 })
    .limit(normalizeLimit(limit))
    .select({
      _id: 1,
      fullName: 1,
      username: 1,
      email: 1,
      createdAt: 1,
      isBlocked: 1,
    })
    .lean();

  return users.map((user) => ({
    id: user._id.toString(),
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    isBlocked: user.isBlocked,
  }));
}

export async function getPendingNutritionists(
  limit: number,
): Promise<AdminDashboardPendingNutritionist[]> {
  const profiles = await NutritionistProfileModel.aggregate<PendingNutritionistResult>([
    { $match: { applicationStatus: "pending" } },
    {
      $lookup: {
        from: UserModel.collection.name,
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $match: { "user.deletedAt": null } },
    { $sort: { createdAt: -1, _id: -1 } },
    { $limit: normalizeLimit(limit) },
    {
      $project: {
        _id: 1,
        userId: 1,
        fullName: "$user.fullName",
        email: "$user.email",
        applicationStatus: 1,
        createdAt: 1,
      },
    },
  ]);

  return profiles.map((profile) => ({
    id: String(profile._id),
    userId: String(profile.userId),
    fullName: profile.fullName,
    email: profile.email,
    applicationStatus: profile.applicationStatus,
    createdAt: profile.createdAt,
  }));
}

export async function getRecentPayments(
  limit: number,
): Promise<AdminDashboardRecentPayment[]> {
  const payments = await PaymentModel.aggregate<RecentPaymentResult>([
    { $match: { resourceType: "nutritionist_plan" } },
    {
      $lookup: {
        from: UserModel.collection.name,
        localField: "userId",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $sort: { createdAt: -1, _id: -1 } },
    { $limit: normalizeLimit(limit) },
    {
      $project: {
        _id: 1,
        userId: 1,
        customerName: {
          $ifNull: ["$customer.fullName", "Unknown user"],
        },
        amount: 1,
        currency: 1,
        status: 1,
        createdAt: 1,
      },
    },
  ]);

  return payments.map((payment) => ({
    id: String(payment._id),
    userId: String(payment.userId),
    customerName: payment.customerName,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    createdAt: payment.createdAt,
  }));
}