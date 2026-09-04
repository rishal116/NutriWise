import { injectable } from "inversify";
import { AccessToken } from "livekit-server-sdk";

import { ILiveKitService } from "../../interfaces/livekit/ILiveKitService";

@injectable()
export class LiveKitService implements ILiveKitService {
  async generateParticipantToken(input: {
    identity: string;
    roomId: string;
    canPublish: boolean;
    canSubscribe: boolean;
  }): Promise<string> {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error("LiveKit credentials are not configured");
    }

    const accessToken = new AccessToken(apiKey, apiSecret, {
      identity: input.identity,
      ttl: "2h",
    });

    accessToken.addGrant({
      roomJoin: true,
      room: input.roomId,
      canPublish: input.canPublish,
      canSubscribe: input.canSubscribe,
    });

    return accessToken.toJwt();
  }
}
