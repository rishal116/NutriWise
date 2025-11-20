import { Request, Response, NextFunction } from "express";

export const requireRole = (role: "client" | "nutritionist" | "admin") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

