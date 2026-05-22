import { AccessToken } from "livekit-server-sdk";
import { LIVEKIT_API_KEY, LIVEKIT_API_SECRET } from "../../../configs/livekit";
import { container } from "../../../configs/inversify";
import { TYPES } from "../../../types/types";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

export const generateToken = async (
  userId: string,
  roomId: string,
): Promise<string> => {
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new CustomError("user not found",StatusCode.NOT_FOUND)
  }
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: userId,
    name: user.fullName,
  });

  at.addGrant({
    roomJoin: true,
    room: roomId,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return await at.toJwt();
};
