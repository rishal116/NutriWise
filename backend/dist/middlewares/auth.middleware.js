"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../configs/jwt");
const customError_1 = require("../utils/customError");
const statusCode_enum_1 = require("../enums/statusCode.enum");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new customError_1.CustomError("Authorization header missing", statusCode_enum_1.StatusCode.UNAUTHORIZED);
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.accessToken.secret);
        // attach user data to request object
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new customError_1.CustomError("Token expired", statusCode_enum_1.StatusCode.UNAUTHORIZED));
        }
        if (error.name === "JsonWebTokenError") {
            return next(new customError_1.CustomError("Invalid token", statusCode_enum_1.StatusCode.UNAUTHORIZED));
        }
        next(new customError_1.CustomError("Authentication failed", statusCode_enum_1.StatusCode.UNAUTHORIZED));
    }
};
exports.authMiddleware = authMiddleware;
