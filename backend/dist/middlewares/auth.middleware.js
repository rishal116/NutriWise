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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new customError_1.CustomError("Authorization header missing", statusCode_enum_1.StatusCode.UNAUTHORIZED);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.accessToken.secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        throw new customError_1.CustomError("Invalid or expired token", statusCode_enum_1.StatusCode.UNAUTHORIZED);
    }
};
exports.authMiddleware = authMiddleware;
