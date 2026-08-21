import { PipelineStage, Types } from "mongoose";

import { BaseRepository } from "../../common/base.repository";
import { IUserMeetingRepository } from "../../../interfaces/user/meeting/IUserMeetingRepository";

import {
  IMeeting,
  MeetingModel,
  MeetingStatus,
} from "../../../../models/meeting.model";

import { encodeCursor, decodeCursor } from "../../../../utils/cursor.util";

import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";

import {
  UserMeetingListQueryDTO,
  MeetingSortBy,
  MeetingSortOrder,
} from "../../../../dtos/user/meeting/user-meeting-list-query.dto";

import {
  MeetingCard,
  MeetingCardWithCursor,
} from "../../../../types/user/meeting/user-meeting-card.type";

import { MeetingDetails } from "../../../../types/user/meeting/user-meeting-details.type";

export class UserMeetingRepository
  extends BaseRepository<IMeeting>
  implements IUserMeetingRepository
{
  constructor() {
    super(MeetingModel);
  }

  async findUserMeetings(
    userId: string,
    query: UserMeetingListQueryDTO,
  ): Promise<CursorPaginationResult<MeetingCard>> {
    const {
      limit = 12,
      cursor,
      search,
      status,
      type,
      sortBy = MeetingSortBy.SCHEDULED_AT,
      sortOrder = MeetingSortOrder.DESC,
    } = query;

    const searchText = search?.trim();
    const cursorData = decodeCursor(cursor);

    const userObjectId = new Types.ObjectId(userId);

    const sortOrderValue = sortOrder === MeetingSortOrder.DESC ? -1 : 1;

    const cursorSortKey = `${sortBy}:${sortOrder}`;

    if (cursorData?.sortKey && cursorData.sortKey !== cursorSortKey) {
      throw new Error("Invalid cursor");
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userObjectId,
          isDeleted: false,

          ...(status && {
            status,
          }),

          ...(type && {
            type,
          }),
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "nutritionistId",
          foreignField: "_id",
          as: "nutritionist",
        },
      },

      {
        $unwind: "$nutritionist",
      },
    ];

    if (searchText) {
      pipeline.push({
        $match: {
          $or: [
            {
              title: {
                $regex: searchText,
                $options: "i",
              },
            },
            {
              "nutritionist.fullName": {
                $regex: searchText,
                $options: "i",
              },
            },
            {
              "nutritionist.email": {
                $regex: searchText,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    let sortField: string;

    switch (sortBy) {
      case MeetingSortBy.CREATED_AT:
        sortField = "createdAt";
        break;

      case MeetingSortBy.TITLE:
        sortField = "title";
        break;

      case MeetingSortBy.SCHEDULED_AT:
      default:
        sortField = "scheduledAt";
        break;
    }

    if (cursorData) {
      let cursorValue: string | Date = cursorData.value as string;

      if (
        sortBy === MeetingSortBy.SCHEDULED_AT ||
        sortBy === MeetingSortBy.CREATED_AT
      ) {
        cursorValue = new Date(cursorData.value as string);
      }

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]:
                sortOrderValue === -1
                  ? { $lt: cursorValue }
                  : { $gt: cursorValue },
            },

            {
              [sortField]: cursorValue,

              _id:
                sortOrderValue === -1
                  ? {
                      $lt: new Types.ObjectId(cursorData.id),
                    }
                  : {
                      $gt: new Types.ObjectId(cursorData.id),
                    },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          [sortField]: sortOrderValue,
          _id: sortOrderValue,
        },
      },

      {
        $limit: limit + 1,
      },

      {
        $project: {
          _id: {
            $toString: "$_id",
          },

          title: 1,

          nutritionist: {
            _id: {
              $toString: "$nutritionist._id",
            },

            fullName: "$nutritionist.fullName",

            email: "$nutritionist.email",

            profileImage: "$nutritionist.profileImage",
          },

          scheduledAt: 1,

          durationInMinutes: 1,

          status: 1,

          type: 1,

          cursorId: "$_id",

          cursorValue: `$${sortField}`,
        },
      },
    );

    const result = await this._model.aggregate<MeetingCardWithCursor>(pipeline);

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),

            value:
              lastItem.cursorValue instanceof Date
                ? lastItem.cursorValue.toISOString()
                : lastItem.cursorValue,

            sortKey: cursorSortKey,
          })
        : null;

    const cleanItems: MeetingCard[] = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async findMeetingDetails(
    userId: string,
    meetingId: string,
  ): Promise<MeetingDetails | null> {
    const meetingObjectId = new Types.ObjectId(meetingId);

    const userObjectId = new Types.ObjectId(userId);

    const meeting = await this._model
      .findOne({
        _id: meetingObjectId,
        userId: userObjectId,
        isDeleted: false,
      })
      .populate("nutritionistId", "_id fullName email profileImage")
      .lean()
      .exec();

    if (!meeting) {
      return null;
    }

    const populatedNutritionist = meeting.nutritionistId as unknown as {
      _id: Types.ObjectId;
      fullName: string;
      email: string;
      profileImage?: string;
    };

    return {
      _id: meeting._id,

      title: meeting.title,

      nutritionist: {
        _id: populatedNutritionist._id,
        fullName: populatedNutritionist.fullName,
        email: populatedNutritionist.email,

        ...(populatedNutritionist.profileImage && {
          profileImage: populatedNutritionist.profileImage,
        }),
      },

      roomId: meeting.roomId,

      scheduledAt: meeting.scheduledAt,

      durationInMinutes: meeting.durationInMinutes,

      status: meeting.status,

      type: meeting.type,

      startedAt: meeting.startedAt,

      endedAt: meeting.endedAt,

      nutritionistJoinedAt: meeting.nutritionistJoinedAt,

      userJoinedAt: meeting.userJoinedAt,

      isCancelledByUser: meeting.isCancelledByUser,

      isCancelledByNutritionist: meeting.isCancelledByNutritionist,

      isDeleted: meeting.isDeleted,

      createdAt: meeting.createdAt,

      updatedAt: meeting.updatedAt,
    };
  }

  async findByRoomId(roomId: string): Promise<MeetingDetails | null> {
    const meeting = await this._model
      .findOne({
        roomId,
        isDeleted: false,
      })
      .populate("nutritionistId", "_id fullName email profileImage")
      .lean()
      .exec();

    if (!meeting) {
      return null;
    }

    const populatedNutritionist = meeting.nutritionistId as unknown as {
      _id: Types.ObjectId;
      fullName: string;
      email: string;
      profileImage?: string;
    };

    return {
      _id: meeting._id,

      title: meeting.title,

      nutritionist: {
        _id: populatedNutritionist._id,
        fullName: populatedNutritionist.fullName,
        email: populatedNutritionist.email,

        ...(populatedNutritionist.profileImage && {
          profileImage: populatedNutritionist.profileImage,
        }),
      },

      roomId: meeting.roomId,

      scheduledAt: meeting.scheduledAt,

      durationInMinutes: meeting.durationInMinutes,

      status: meeting.status,

      type: meeting.type,

      startedAt: meeting.startedAt,

      endedAt: meeting.endedAt,

      nutritionistJoinedAt: meeting.nutritionistJoinedAt,

      userJoinedAt: meeting.userJoinedAt,

      isCancelledByUser: meeting.isCancelledByUser,

      isCancelledByNutritionist: meeting.isCancelledByNutritionist,

      isDeleted: meeting.isDeleted,

      createdAt: meeting.createdAt,

      updatedAt: meeting.updatedAt,
    };
  }

  async updateStatusByRoomId(
    roomId: string,
    status: MeetingStatus,
    extraFields?: Partial<IMeeting>,
  ): Promise<MeetingDetails | null> {
    const meeting = await this._model
      .findOneAndUpdate(
        {
          roomId,
          isDeleted: false,
        },
        {
          $set: {
            status,
            ...extraFields,
          },
        },
        {
          new: true,
        },
      )
      .populate("nutritionistId", "_id fullName email profileImage")
      .lean()
      .exec();

    if (!meeting) {
      return null;
    }

    const populatedNutritionist = meeting.nutritionistId as unknown as {
      _id: Types.ObjectId;
      fullName: string;
      email: string;
      profileImage?: string;
    };

    return {
      _id: meeting._id,

      title: meeting.title,

      nutritionist: {
        _id: populatedNutritionist._id,
        fullName: populatedNutritionist.fullName,
        email: populatedNutritionist.email,

        ...(populatedNutritionist.profileImage && {
          profileImage: populatedNutritionist.profileImage,
        }),
      },

      roomId: meeting.roomId,

      scheduledAt: meeting.scheduledAt,

      durationInMinutes: meeting.durationInMinutes,

      status: meeting.status,

      type: meeting.type,

      startedAt: meeting.startedAt,

      endedAt: meeting.endedAt,

      nutritionistJoinedAt: meeting.nutritionistJoinedAt,

      userJoinedAt: meeting.userJoinedAt,

      isCancelledByUser: meeting.isCancelledByUser,

      isCancelledByNutritionist: meeting.isCancelledByNutritionist,

      isDeleted: meeting.isDeleted,

      createdAt: meeting.createdAt,

      updatedAt: meeting.updatedAt,
    };
  }
}
