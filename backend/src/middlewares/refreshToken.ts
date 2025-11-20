import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { generateTokens, setAuthCookies } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

export const refreshToken = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "No refresh token found" });
        }
        const decoded = jwt.verify( token, jwtConfig.refreshToken.secret ) as { userId: string; role: string };
        const { accessToken, refreshToken } = generateTokens( decoded.userId, decoded.role );
        setAuthCookies(res, refreshToken);
        return res.status(200).json({ success: true, accessToken, role: decoded.role });
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Refresh token expired" });
        }
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};
