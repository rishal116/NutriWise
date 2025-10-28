"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../configs/jwt");
/**
 * Generate both access and refresh tokens
 */
const generateTokens = (userId, role) => {
    const payload = { userId, role };
    const accessToken = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.accessToken.secret, {
        expiresIn: jwt_1.jwtConfig.accessToken.expiresIn,
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.refreshToken.secret, {
        expiresIn: jwt_1.jwtConfig.refreshToken.expiresIn,
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
/**
 * Verify Access Token
 */
const verifyAccessToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.accessToken.secret);
        return payload;
    }
    catch (error) {
        throw new Error("Invalid or expired access token");
    }
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.refreshToken.secret);
        return payload;
    }
    catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
