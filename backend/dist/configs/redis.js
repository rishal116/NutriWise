"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});
redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));
(async () => {
    try {
        await redisClient.connect();
        console.log("✅ Redis connected successfully");
    }
    catch (err) {
        console.error("Redis connection failed:", err);
    }
})();
exports.default = redisClient;
