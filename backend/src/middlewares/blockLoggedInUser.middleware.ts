import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { Role } from "../types/role";

interface JwtPayload {
  userId: string;
  role: Role;
}

export const blockLoggedInUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

    // Query DB for dynamic blocked status
    const user = await UserModel.findById(decoded.userId).select("role isBlocked");

    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account has been blocked by admin" });
    }

    // Attach user to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
