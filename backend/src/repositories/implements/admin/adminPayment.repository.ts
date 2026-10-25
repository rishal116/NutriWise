import { FilterQuery, Types } from "mongoose";

import {
  PaymentModel,
  type IPayment,
  type PaymentStatus,
  type PaymentResourceType,
} from "../../../models/payment.model";
import { IAdminPaymentRepository } from "../../interfaces/admin/IAdminPaymentRepository";
import { BaseRepository } from "../common/base.repository";

export interface IAdminPaymentFilters {
  search?: string;
  status?: PaymentStatus;
  resourceType?: PaymentResourceType;
  page: number;
  limit: number;
}
export class AdminPaymentRepository
  extends BaseRepository<IPayment>
  implements IAdminPaymentRepository
{
  async findAll(filters: IAdminPaymentFilters) {
    const { search, status, resourceType, page, limit } = filters;

    const query: FilterQuery<IPayment> = {};

    if (status) {
      query.status = status;
    }

    if (resourceType) {
      query.resourceType = resourceType;
    }

    if (search?.trim()) {
      const searchTerm = search.trim();
      const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.$or = [
        { checkoutSessionId: { $regex: escapedSearch, $options: "i" } },
        { paymentIntentId: { $regex: escapedSearch, $options: "i" } },
        { chargeId: { $regex: escapedSearch, $options: "i" } },
        { "itemSnapshot.title": { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      PaymentModel.find(query)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      PaymentModel.countDocuments(query).exec(),
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(paymentId: string): Promise<IPayment | null> {
    if (!Types.ObjectId.isValid(paymentId)) {
      return null;
    }

    return PaymentModel.findById(paymentId).lean().exec();
  }

  async count(
    filters: Pick<IAdminPaymentFilters, "status" | "resourceType">,
  ): Promise<number> {
    const query: FilterQuery<IPayment> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.resourceType) {
      query.resourceType = filters.resourceType;
    }

    return PaymentModel.countDocuments(query).exec();
  }
}
