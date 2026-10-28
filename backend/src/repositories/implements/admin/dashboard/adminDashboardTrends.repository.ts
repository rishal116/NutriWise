import { UserModel } from "../../../../models/user.model";
import { NutritionistProfileModel } from "../../../../models/nutritionistProfile.model";
import { PaymentModel } from "../../../../models/payment.model";

import type {
  AdminDashboardTrend,
  AdminDashboardRegistrationTrend,
  AdminDashboardRevenueTrend,
} from "../../../../types/admin/dashboard/admin-dashboard.types";

export async function getRegistrationTrend(
  startDate: Date,
  endDate: Date,
): Promise<AdminDashboardRegistrationTrend[]> {
  return UserModel.aggregate<AdminDashboardRegistrationTrend>([
    {
      $match: {
        deletedAt: null,
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: "$_id", count: 1 } },
    { $sort: { date: 1 } },
  ]);
}

export async function getUserTrend(
  startDate: Date,
  endDate: Date,
): Promise<AdminDashboardTrend[]> {
  const result = await UserModel.aggregate<AdminDashboardTrend>([
    {
      $match: {
        deletedAt: null,
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        value: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: "$_id", value: 1 } },
    { $sort: { date: 1 } },
  ]);

  return result;
}

export async function getRevenueTrend(
  startDate: Date,
  endDate: Date,
): Promise<AdminDashboardRevenueTrend[]> {
  return PaymentModel.aggregate<AdminDashboardRevenueTrend>([
    {
      $match: {
        resourceType: "nutritionist_plan",
        status: { $in: ["paid", "refunded"] },
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        grossRevenue: { $sum: "$amount" },
        refundedAmount: {
          $sum: { $ifNull: ["$refundedAmount", 0] },
        },
        commissionEarned: { $sum: "$commissionAmount" },
        paymentCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        grossRevenue: 1,
        refundedAmount: 1,
        netRevenue: { $subtract: ["$grossRevenue", "$refundedAmount"] },
        commissionEarned: 1,
        paymentCount: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);
}

export async function getNutritionistTrend(
  startDate: Date,
  endDate: Date,
): Promise<AdminDashboardTrend[]> {
  return NutritionistProfileModel.aggregate<AdminDashboardTrend>([
    {
      $match: {
        applicationStatus: "approved",
        updatedAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$updatedAt",
            timezone: "UTC",
          },
        },
        value: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: "$_id", value: 1 } },
    { $sort: { date: 1 } },
  ]);
}