import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { UserProgramModel } from "../../../../models/userProgram.model";
import { UserRole } from "../../../../enums/user.enum";
import { IMeetingClientOption } from "../../../../types/nutritionist/client/nutriClientDetails.projection";
import { toObjectId } from "./client-query.utils";
import { IMeetingEligibleClientsQuery } from "../../../interfaces/nutritionist/client/IMeetingEligibleClientsQuery";

@injectable()
export class MeetingEligibleClientsQuery implements IMeetingEligibleClientsQuery {
  async execute(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IMeetingClientOption[]> {
    const nutritionistObjectId = toObjectId(nutritionistId);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          nutritionistId: nutritionistObjectId,
          isDeleted: false,
          status: "active",
        },
      },
      {
        $lookup: {
          from: "userplans",
          localField: "userPlanId",
          foreignField: "_id",
          as: "userPlan",
        },
      },
      { $unwind: "$userPlan" },
      {
        $match: {
          "userPlan.subscriptionStatus": "active",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          "user.roles": UserRole.USER,
          "user.isBlocked": false,
          "user.deletedAt": null,
        },
      },
      {
        $group: {
          _id: "$user._id",
          clientId: { $first: "$user._id" },
          fullName: { $first: "$user.fullName" },
          username: { $first: "$user.username" },
          email: { $first: "$user.email" },
          profileImage: { $first: "$user.profileImage" },
        },
      },
      {
        $project: {
          _id: 0,
          clientId: 1,
          fullName: 1,
          username: 1,
          email: 1,
          profileImage: 1,
        },
      },
      { $sort: { fullName: 1, clientId: 1 } },
    ];

    return UserProgramModel.aggregate<IMeetingClientOption>(pipeline);
  }
}
