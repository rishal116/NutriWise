import { Types } from "mongoose";
import { IMeeting } from "../models/meeting.model";

export interface IMeetingWithNutri
  extends Omit<IMeeting, "nutritionistId"> {
  nutritionistId: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
  };
}