"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTempUser = saveTempUser;
exports.findTempUserByEmail = findTempUserByEmail;
exports.deleteTempUser = deleteTempUser;
const redis_1 = __importDefault(require("../configs/redis"));
const TEMP_USER_TTL = 5 * 60; // 5 minutes
async function saveTempUser(email, data) {
    const key = `tempUser:${email}`;
    await redis_1.default.setEx(key, TEMP_USER_TTL, JSON.stringify(data));
    console.log(`🧠 Temp user saved in Redis: ${email}`);
}
async function findTempUserByEmail(email) {
    const key = `tempUser:${email}`;
    const data = await redis_1.default.get(key);
    return data ? JSON.parse(data) : null;
}
async function deleteTempUser(email) {
    const key = `tempUser:${email}`;
    await redis_1.default.del(key);
    console.log(`🗑️ Temp user removed from Redis: ${email}`);
}
