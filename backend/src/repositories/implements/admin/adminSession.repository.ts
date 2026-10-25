import { injectable } from "inversify";
import { Types, type FilterQuery } from "mongoose";

import { BaseRepository } from "../../../base.repository";
import { SessionModel } from "../../../../models/session.model";
import type { ISession } from "../../../../models/session.model";
import {
  SessionRegistrationModel,
} from "../../../../models/session-registration.model";
import type {
  ISessionRegistration,
} from "../../../../models/session-registration.model";

import type {
  IAdminSessionFilters,
  IAdminSessionListResult,
  IAdminSessionRegistrationFilters,
  IAdminSessionRegistrationListResult,
  IAdminSessionRegistrationSummary,
  IAdminSessionRepository,
} from "../../../interfaces/admin/session/IAdminSessionRepository";

@injectable()
export class AdminSessionRepository
  extends BaseRepository<ISession>
  implements IAdminSessionRepository
{
  constructor() {
    super(SessionModel);
  }

  async findAll(
    filters: IAdminSessionFilters,
  ): Promise<IAdminSessionListResult> {
    const { search, type, pricingType, status, fromDate, toDate, page, limit } =
      filters;

    const query: FilterQuery<ISession> = {};

    if (search?.trim()) {
      const escapedSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      query.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
        { roomId: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (type) {
      query.type = type;
    }

    if (pricingType) {
      query["pricing.type"] = pricingType;
    }

    if (status) {
      query.status = status;
    }

    if (fromDate || toDate) {
      query.scheduledAt = {};

      if (fromDate) {
        query.scheduledAt.$gte = fromDate;
      }

      if (toDate) {
        query.scheduledAt.$lte = toDate;
      }
    }

    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      SessionModel.find(query)
        .sort({ scheduledAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      SessionModel.countDocuments(query).exec(),
    ]);

    return {
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(sessionId: string): Promise<ISession | null> {
    if (!Types.ObjectId.isValid(sessionId)) {
      return null;
    }

    return SessionModel.findById(sessionId).exec();
  }

  async findRegistrations(
    sessionId: string,
    filters: IAdminSessionRegistrationFilters,
  ): Promise<IAdminSessionRegistrationListResult> {
    const query: FilterQuery<ISessionRegistration> = {
      sessionId: new Types.ObjectId(sessionId),
    };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    const skip = (filters.page - 1) * filters.limit;

    const [registrations, total] = await Promise.all([
      SessionRegistrationModel.find(query)
        .sort({ registeredAt: -1, _id: -1 })
        .skip(skip)
        .limit(filters.limit)
        .exec(),
      SessionRegistrationModel.countDocuments(query).exec(),
    ]);

    return {
      registrations,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async getRegistrationSummary(
    sessionId: string,
  ): Promise<IAdminSessionRegistrationSummary> {
    const [summary] = await SessionRegistrationModel.aggregate<{
      total: number;
      registered: number;
      cancelled: number;
      attended: number;
      absent: number;
      paymentPending: number;
      paymentPaid: number;
      paymentFailed: number;
      paymentRefunded: number;
    }>([
      {
        $match: {
          sessionId: new Types.ObjectId(sessionId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          registered: {
            $sum: { $cond: [{ $eq: ["$status", "registered"] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          attended: {
            $sum: { $cond: [{ $eq: ["$status", "attended"] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
          },
          paymentPending: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0],
            },
          },
          paymentPaid: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0],
            },
          },
          paymentFailed: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "failed"] }, 1, 0],
            },
          },
          paymentRefunded: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "refunded"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          registered: 1,
          cancelled: 1,
          attended: 1,
          absent: 1,
          paymentPending: 1,
          paymentPaid: 1,
          paymentFailed: 1,
          paymentRefunded: 1,
        },
      },
    ]).exec();

    return (
      summary ?? {
        total: 0,
        registered: 0,
        cancelled: 0,
        attended: 0,
        absent: 0,
        paymentPending: 0,
        paymentPaid: 0,
        paymentFailed: 0,
        paymentRefunded: 0,
      }
    );
  }
}