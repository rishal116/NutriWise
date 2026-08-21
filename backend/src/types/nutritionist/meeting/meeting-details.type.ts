import { Types } from "mongoose";
import { MeetingStatus, MeetingType } from "../../../models/meeting.model";

export interface MeetingDetails {
  _id: Types.ObjectId;

  title: string;

  nutritionistId: Types.ObjectId;

  user: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    profileImage?: string;
  };

  roomId: string;

  scheduledAt: Date;

  durationInMinutes: number;

  status: MeetingStatus;

  type: MeetingType;

  startedAt?: Date;
  endedAt?: Date;

  nutritionistJoinedAt?: Date;
  userJoinedAt?: Date;

  isCancelledByUser: boolean;
  isCancelledByNutritionist: boolean;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}