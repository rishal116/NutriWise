import { Request } from "express";

export interface TempUserSession {
  fullName: string;
  email: string;
  password: string;
}

export const getTempUser = (req: Request) => req.session.tempUser;

export const setTempUser = (req: Request, tempUser: TempUserSession) => {
  req.session.tempUser = tempUser;
};

export const deleteTempUser = (req: Request) => {
  delete req.session.tempUser;
};
