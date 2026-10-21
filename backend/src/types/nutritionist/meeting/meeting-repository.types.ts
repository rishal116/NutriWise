import { Types } from "mongoose";
import { IMeeting, MeetingStatus } from "../../../models/meeting.model";

export type MeetingStatusUpdateFields = Partial<
  Pick<IMeeting, "startedAt" | "endedAt" | "cancelledBy">
>;

export type MeetingRoomRecord = Pick<
  IMeeting,
  | "_id"
  | "nutritionistId"
  | "userId"
  | "roomId"
  | "status"
  | "durationInMinutes"
  | "startedAt"
  | "endedAt"
  | "cancelledBy"
>;

export type MeetingByRoomRecord = Pick<
  IMeeting,
  | "_id"
  | "nutritionistId"
  | "userId"
  | "roomId"
  | "status"
  | "durationInMinutes"
  | "startedAt"
  | "endedAt"
>;

export interface MeetingCardAggregationResult {
  _id: string;
  title: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  scheduledAt: Date;
  durationInMinutes: number;
  status: MeetingStatus;
  cursorId: Types.ObjectId;
  cursorValue: Date | string;
}
