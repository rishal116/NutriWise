import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IAdminUserRepository } from "../../interfaces/admin/IAdminUserRepository";
import { UserModel, IUser } from "../../../models/user.model";
import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";
import { UserRole } from "../../../enums/user.enum";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import { IAdminUserListProjection } from "../../../types/admin/user/admin-user-list.projection";
import { HealthDetailsModel } from "../../../models/healthDetails.model"; 
import { IAdminUserDetailsProjection } from "../../../types/admin/user/admin-user-details.projection";

type AdminUserListItemWithCursor = IAdminUserListProjection & {
  cursorValue: Date;
};

const ADMIN_USER_SORT_FIELD_MAP = {
  newest: "createdAt",
  oldest: "createdAt",
} as const;

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class AdminUserRepository
  extends BaseRepository<IUser>
  implements IAdminUserRepository
{
  constructor() {
    super(UserModel);
  }

  async getUsers(
    query: AdminUserListQueryDto,
  ): Promise<CursorPaginationResult<IAdminUserListProjection>> {
    const {
      search,
      isBlocked,
      sortBy = "newest",
      cursor,
      limit = DEFAULT_PAGE_SIZE,
    } = query;

    const pageSize = Math.min(Math.max(Math.trunc(limit), 1), MAX_PAGE_SIZE);

    const sortField = ADMIN_USER_SORT_FIELD_MAP[sortBy];
    const isAscending = sortBy === "oldest";
    const direction = isAscending ? 1 : -1;

    const cursorData = decodeCursor(cursor);

    if (cursorData) {
      if (
        cursorData.sortKey !== sortBy ||
        typeof cursorData.value !== "string" ||
        !Number.isFinite(Date.parse(cursorData.value))
      ) {
        throw new Error("Invalid cursor");
      }
    }

    const matchStage: Record<string, unknown> = {
      deletedAt: null,
      roles: {
        $nin: [UserRole.ADMIN],
      },
    };

    if (isBlocked !== undefined) {
      matchStage.isBlocked = isBlocked;
    }

    const keyword = search?.trim();

    if (keyword) {
      const escapedKeyword = escapeRegex(keyword);
      const searchRegex = {
        $regex: escapedKeyword,
        $options: "i",
      };

      matchStage.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { username: searchRegex },
      ];
    }

    const pipeline: PipelineStage[] = [
      {
        $match: matchStage,
      },
    ];

    if (cursorData) {
      const cursorDate = new Date(cursorData.value);
      const cursorId = new Types.ObjectId(cursorData.id);

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]: {
                [isAscending ? "$gt" : "$lt"]: cursorDate,
              },
            },
            {
              [sortField]: cursorDate,
              _id: {
                [isAscending ? "$gt" : "$lt"]: cursorId,
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          [sortField]: direction,
          _id: direction,
        },
      },
      {
        $limit: pageSize + 1,
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          username: 1,
          profileImage: 1,
          activeRole: 1,
          isBlocked: 1,
          createdAt: 1,
          cursorValue: `$${sortField}`,
        },
      },
    );

    const result =
      await this._model.aggregate<AdminUserListItemWithCursor>(pipeline);

    const hasMore = result.length > pageSize;
    const items = hasMore ? result.slice(0, pageSize) : result;
    const lastItem = items.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem._id.toString(),
            value: lastItem.cursorValue.toISOString(),
            sortKey: sortBy,
          })
        : null;

    const cleanItems: IAdminUserListProjection[] = items.map(
      ({ cursorValue: _cursorValue, ...user }) => user,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async getUserDetailsById(
    userId: string,
  ): Promise<IAdminUserDetailsProjection | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    const userObjectId = new Types.ObjectId(userId);

    const user = await this._model
      .findOne({
        _id: userObjectId,
        deletedAt: null,
        roles: { $nin: [UserRole.ADMIN] },
      })
      .select(
        [
          "_id",
          "fullName",
          "username",
          "email",
          "gender",
          "profileImage",
          "authProvider",
          "emailVerifiedAt",
          "roles",
          "activeRole",
          "isBlocked",
          "isProfileCompleted",
          "createdAt",
          "updatedAt",
        ].join(" "),
      )
      .lean()
      .exec();

    if (!user) {
      return null;
    }

    const healthDetails = await HealthDetailsModel.findOne({
      userId: userObjectId,
    })
      .select(
        [
          "-_id",
          "heightCm",
          "weightKg",
          "activityLevel",
          "dietType",
          "goal",
          "targetWeightKg",
          "preferredTimeline",
        ].join(" "),
      )
      .lean()
      .exec();

    return {
      ...user,
      healthDetails,
    } as IAdminUserDetailsProjection;
  }

  async updateBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
    await this._model.updateOne(
      {
        _id: userId,
        deletedAt: null,
        roles: { $nin: [UserRole.ADMIN] },
      },
      {
        $set: { isBlocked },
      },
    );
  }

  async addRole(userId: string, role: UserRole): Promise<void> {
    await this._model.updateOne(
      {
        _id: userId,
        deletedAt: null,
      },
      {
        $addToSet: {
          roles: role,
        },
      },
    );
  }
}
