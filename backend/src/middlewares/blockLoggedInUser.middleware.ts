import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

export const blockLoggedInUser = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    console.log(refreshToken)
    if (!refreshToken){
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
        const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "User not found" });
        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account has been blocked by admin" });
        }
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
