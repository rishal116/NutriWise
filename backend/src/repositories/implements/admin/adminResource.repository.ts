import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { ResourceModel } from "../../../models/resource.model";
import { UserModel } from "../../../models/user.model"; 
import type { IResource } from "../../../models/resource.model";

import type {
  IAdminResource,
  IAdminResourceQuery,
} from "../../../types/admin/resource/resource.types";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { IAdminResourceRepository } from "../../interfaces/admin/IAdminResourceRepository";

import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";
import { BaseRepository } from "../common/base.repository";

@injectable()
export class AdminResourceRepository
  extends BaseRepository<IResource>
  implements IAdminResourceRepository
{
  constructor() {
    super(ResourceModel);
  }

  async getResources(
    query: IAdminResourceQuery,
  ): Promise<CursorPaginationResult<IAdminResource>> {
    const { limit, cursor } = query;

    const match: PipelineStage.Match["$match"] = {};

    if (cursor) {
      const decodedCursor = decodeCursor(cursor);

      if (!decodedCursor || decodedCursor.sortKey !== "createdAt") {
        throw new Error("Invalid resource pagination cursor");
      }

      const cursorDate = new Date(String(decodedCursor.value));

      if (Number.isNaN(cursorDate.getTime())) {
        throw new Error("Invalid resource pagination cursor");
      }

      const cursorId = new Types.ObjectId(decodedCursor.id);

      match.$or = [
        { createdAt: { $lt: cursorDate } },
        {
          createdAt: cursorDate,
          _id: { $lt: cursorId },
        },
      ];
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: limit + 1 },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "createdBy",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: {
          path: "$creator",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          type: 1,
          category: 1,
          content: 1,
          fileUrl: 1,
          status: 1,
          publishedAt: 1,
          viewCount: 1,
          likeCount: 1,
          commentCount: 1,
          createdAt: 1,
          updatedAt: 1,
          createdBy: {
            $cond: [
              { $ifNull: ["$creator._id", false] },
              {
                _id: "$creator._id",
                fullName: "$creator.fullName",
                profileImage: "$creator.profileImage",
              },
              null,
            ],
          },
        },
      },
    ];

    const resources =
      await ResourceModel.aggregate<IAdminResource>(pipeline).exec();

    const hasMore = resources.length > limit;
    const items = hasMore ? resources.slice(0, limit) : resources;
    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem._id.toString(),
            value: lastItem.createdAt.toISOString(),
            sortKey: "createdAt",
          })
        : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }
}
