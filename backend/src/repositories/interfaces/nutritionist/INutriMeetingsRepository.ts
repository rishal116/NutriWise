import { IMeeting } from "../../../models/meeting.model";
import { IMeetingWithNutri } from "../../../types/meetingWithNutri.populated";
import { IMeetingWithUser } from "../../../types/meetingWithUser.populated";

export interface INutriMeetingsRepository {
  createMeeting(data: Partial<IMeeting>): Promise<IMeeting>;

  findByNutritionistId(nutritionistId: string): Promise<IMeetingWithUser[]>;

  findByUserId(userId: string): Promise<IMeetingWithNutri[]>;

  findByRoomId(roomId: string): Promise<IMeetingWithUser | null>;

  updateMeetingStatus(
    meetingId: string,
    status: "scheduled" | "ongoing" | "completed" | "cancelled",
    extraFields?: Partial<IMeeting>
  ): Promise<IMeeting | null>;
}
