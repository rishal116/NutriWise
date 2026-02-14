import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { INutriMeetingsRepository } from "../../interfaces/nutritionist/INutriMeetingsRepository";
import { IMeeting, MeetingModel } from "../../../models/meeting.model";
import { IMeetingWithUser } from "../../../types/meetingWithUser.populated";
import { IMeetingWithNutri } from "../../../types/meetingWithNutri.populated";

export class NutriMeetingsRepository
  extends BaseRepository<IMeeting>
  implements INutriMeetingsRepository
{
  constructor() {
    super(MeetingModel);
  }

  async createMeeting(data: Partial<IMeeting>): Promise<IMeeting> {
    return this._model.create(data);
  }
  
async findByNutritionistId(
  nutritionistId: string
): Promise<IMeetingWithUser[]> {
  return this._model
    .find({ nutritionistId: new Types.ObjectId(nutritionistId) })
    .populate("userId", "fullName email")
    .sort({ scheduledAt: -1 })
    .lean<IMeetingWithUser[]>();
}

  async findByUserId(userId: string): Promise<IMeetingWithNutri[]> {
    return this._model
    .find({ userId: new Types.ObjectId(userId) })
    .populate("nutritionistId", "fullName email")
    .sort({ scheduledAt: -1 })
    .lean<IMeetingWithNutri[]>()
    }

  async findByRoomId(roomId: string): Promise<IMeetingWithUser | null> {
    return this._model.findOne({ roomId });
  }

  async updateMeetingStatus(
    meetingId: string,
    status: "scheduled" | "ongoing" | "completed" | "cancelled",
    extraFields?: Partial<IMeeting>
  ): Promise<IMeeting | null> {
    return this._model.findByIdAndUpdate(
      meetingId,
      {
        $set: {
          status,
          ...extraFields,
        },
      },
      { new: true }
    );
  }
}
