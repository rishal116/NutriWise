import redisClient from "../configs/redis";

const TEMP_USER_TTL = 5 * 60; // 5 minutes

export async function saveTempUser(email: string, data: any): Promise<void> {
  const key = `tempUser:${email}`;
  await redisClient.setEx(key, TEMP_USER_TTL, JSON.stringify(data));
  console.log(`🧠 Temp user saved in Redis: ${email}`);
}

export async function findTempUserByEmail(email: string): Promise<any | null> {
  const key = `tempUser:${email}`;
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
}

export async function deleteTempUser(email: string): Promise<void> {
  const key = `tempUser:${email}`;
  await redisClient.del(key);
  console.log(`🗑️ Temp user removed from Redis: ${email}`);
}
