import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import {
  IUserProgramDay,
  UserProgramDayModel,
} from "../../../models/userProgramDay.model";
import { IUserProgramDayRepository } from "../../interfaces/user/IUserProgramDayRepository";
import {
  IUserProgramDayDetailsProjection,
  IUserProgramDayListProjection,
} from "../../../types/user/program/user-program-day.projection";

@injectable()
export class UserProgramDayRepository
  extends BaseRepository<IUserProgramDay>
  implements IUserProgramDayRepository
{
  constructor() {
    super(UserProgramDayModel);
  }

  async browseProgramDays(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
  ): Promise<IUserProgramDayListProjection[]> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "userprograms",
          localField: "userProgramId",
          foreignField: "_id",
          as: "program",
        },
      },
      {
        $unwind: "$program",
      },
      {
        $match: {
          userProgramId: new Types.ObjectId(programId),
          "program.userId": new Types.ObjectId(userId),
          "program.isDeleted": false,
        },
      },
      {
        $project: {
          _id: 1,
          dayNumber: 1,
          mealCount: {
            $size: "$meals",
          },
          workoutCount: {
            $size: "$workouts",
          },
          habitCount: {
            $size: "$habits",
          },
        },
      },
      {
        $sort: {
          dayNumber: 1,
        },
      },
    ];

    return this._model.aggregate<IUserProgramDayListProjection>(pipeline);
  }

  async findProgramDayDetails(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<IUserProgramDayDetailsProjection | null> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "userprograms",
          localField: "userProgramId",
          foreignField: "_id",
          as: "program",
        },
      },
      {
        $unwind: "$program",
      },
      {
        $match: {
          userProgramId: new Types.ObjectId(programId),
          dayNumber,
          "program.userId": new Types.ObjectId(userId),
          "program.isDeleted": false,
        },
      },
      {
        $project: {
          _id: 1,
          dayNumber: 1,
          meals: 1,
          workouts: 1,
          habits: 1,
        },
      },
    ];

    const [day] =
      await this._model.aggregate<IUserProgramDayDetailsProjection>(pipeline);

    return day ?? null;
  }
}