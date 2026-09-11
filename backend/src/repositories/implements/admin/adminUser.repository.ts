import { PipelineStage, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { IAdminUserRepository } from "../../interfaces/admin/IAdminUserRepository";

import { UserModel, IUser } from "../../../models/user.model";

import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";

import { AdminUserListItemDto } from "../../../dtos/admin/user/admin-user-list-item.dto";

import { UserRole } from "../../../enums/user.enum";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

type AdminUserListItemWithCursor = AdminUserListItemDto & {
  cursorId: Types.ObjectId;
  cursorValue: Date;
};

const ADMIN_USER_SORT_FIELD_MAP = {
  newest: "createdAt",
  oldest: "createdAt",
} as const;

export class AdminUserRepository
  extends BaseRepository<IUser>
  implements IAdminUserRepository
{
  constructor() {
    super(UserModel);
  }

  async getUsers(
    query: AdminUserListQueryDto,
  ): Promise<CursorPaginationResult<AdminUserListItemDto>> {
    const { search, isBlocked, sortBy = "newest", cursor, limit = 12 } = query;

    const sortField = ADMIN_USER_SORT_FIELD_MAP[sortBy];

    const cursorData = decodeCursor(cursor);

    const matchStage: Record<string, unknown> = {
      deletedAt: null,
      roles: {
        $nin: [UserRole.ADMIN],
      },
    };

    if (isBlocked !== undefined) {
      matchStage.isBlocked = isBlocked;
    }

    if (search?.trim()) {
      const keyword = search.trim();

      matchStage.$or = [
        {
          fullName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          username: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    const pipeline: PipelineStage[] = [
      {
        $match: matchStage,
      },
    ];

    const isAscending = sortBy === "oldest";

    if (cursorData) {
      const cursorValue = new Date(cursorData.value);

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]: {
                [isAscending ? "$gt" : "$lt"]: cursorValue,
              },
            },
            {
              [sortField]: cursorValue,
              _id: {
                [isAscending ? "$gt" : "$lt"]: new Types.ObjectId(
                  cursorData.id,
                ),
              },
            },
          ],
        },
      });
    }

    pipeline.push({
      $sort: {
        [sortField]: isAscending ? 1 : -1,
        _id: isAscending ? 1 : -1,
      },
    });

    pipeline.push({
      $limit: limit + 1,
    });

    pipeline.push({
      $project: {
        _id: 0,

        id: {
          $toString: "$_id",
        },

        fullName: 1,
        email: 1,
        username: 1,
        profileImage: 1,
        activeRole: 1,
        isBlocked: 1,
        isProfileCompleted: 1,
        createdAt: 1,

        cursorId: "$_id",
        cursorValue: `$${sortField}`,
      },
    });

    const result =
      await this._model.aggregate<AdminUserListItemWithCursor>(pipeline);

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue.toISOString(),
            sortKey: sortBy,
          })
        : null;

    const cleanItems = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...user }) => user,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async updateBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
    await this._model.updateOne(
      { _id: userId },
      {
        $set: {
          isBlocked,
        },
      },
    );
  }

  async addRole(userId: string, role: UserRole): Promise<void> {
    await this._model.updateOne(
      { _id: userId },
      {
        $addToSet: {
          roles: role,
        },
      },
    );
  }
}
