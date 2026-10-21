import { Types } from "mongoose";
import {
  MeetingCancelledBy,
  MeetingStatus,
} from "../../../models/meeting.model";

export interface MeetingParticipantDetails {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  profileImage?: string;
}

export interface MeetingDetails {
  _id: Types.ObjectId;
  title: string;
  nutritionistId: Types.ObjectId;
  user: MeetingParticipantDetails;
  roomId: string;
  scheduledAt: Date;
  durationInMinutes: number;
  status: MeetingStatus;
  startedAt?: Date;
  endedAt?: Date;
  cancelledBy?: MeetingCancelledBy;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
