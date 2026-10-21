import { Types } from "mongoose";
import {
  MeetingStatus,
  MeetingCancelledBy,
} from "../../../models/meeting.model";

export interface MeetingDetails {
  _id: Types.ObjectId;
  title: string;
  nutritionist: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  roomId: string;
  scheduledAt: Date;
  durationInMinutes: number;
  status: MeetingStatus;
  startedAt?: Date;
  endedAt?: Date;
  cancelledBy?: MeetingCancelledBy;
  cancellationReason?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
