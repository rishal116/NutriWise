import { Types } from "mongoose";

import {
  MeetingStatus,
  MeetingType,
} from "../../../models/meeting.model";

export interface MeetingCard {
  _id: string;

  title: string;

  nutritionist: {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };

  scheduledAt: Date;

  durationInMinutes: number;

  status: MeetingStatus;

  type: MeetingType;
}

export interface MeetingCardWithCursor extends MeetingCard {
  cursorId: Types.ObjectId;
  cursorValue: string | Date;
}