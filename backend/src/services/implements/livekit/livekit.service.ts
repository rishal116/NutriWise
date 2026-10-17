import { injectable } from "inversify";
import { AccessToken } from "livekit-server-sdk";

import { ILiveKitService } from "../../interfaces/livekit/ILiveKitService";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

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
    const serverUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      throw new CustomError(
        "LiveKit credentials or server URL are not configured",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(serverUrl);
    } catch {
      throw new CustomError(
        "LiveKit server URL is invalid",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    if (!["https:", "wss:", "http:", "ws:"].includes(parsedUrl.protocol)) {
      throw new CustomError(
        "LiveKit server URL must use HTTP(S) or WS(S)",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
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
      canPublishData: true,
    });

    const token = await accessToken.toJwt();

    console.info("[LiveKit] Token generated", {
      identity: input.identity,
      roomId: input.roomId,
      canPublish: input.canPublish,
      canSubscribe: input.canSubscribe,
      urlProtocol: parsedUrl.protocol,
      urlHost: parsedUrl.host,
      tokenGenerated: token.length > 0,
    });

    return token;
  }
}
