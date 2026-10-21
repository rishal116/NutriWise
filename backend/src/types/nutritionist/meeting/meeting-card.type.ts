import { MeetingStatus } from "../../../models/meeting.model";

export interface MeetingCard {
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
}

export interface MeetingCardWithCursor extends MeetingCard {
  cursorId: string;
  cursorValue: string | Date;
}
