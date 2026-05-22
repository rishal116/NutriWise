import { IUser } from "../models/user.model";
import { ISession } from "../models/session.model";

export type PopulatedSession = Omit<ISession, "nutritionistId"> & {
  nutritionistId: Pick<IUser, "_id" | "fullName" | "email">;
};