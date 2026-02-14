import { Types } from "mongoose";
import { IMeeting } from "../models/meeting.model";

export interface IMeetingWithUser
  extends Omit<IMeeting, "userId"> {
  userId: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
  };
}