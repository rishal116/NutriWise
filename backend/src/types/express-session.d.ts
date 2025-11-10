import "express-session";

declare module "express-session" {
  interface SessionData {
    tempUser?: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    };
  }
}
