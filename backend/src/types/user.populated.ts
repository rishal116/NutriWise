// src/types/user.populated.ts
import { Types } from "mongoose";

export interface IUserPopulated {
  _id: Types.ObjectId;
  name: string;
  email: string;
}
