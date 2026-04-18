import { IJoinRequest } from "../../models/joinRequest.model";
import { JoinRequestDto } from "../../dtos/nutritionist/joinRequest.dto";

export class JoinRequestMapper {
  static toDto(
    request: IJoinRequest,
    name: string,
    profileImage?: string | null,
  ): JoinRequestDto {
    return {
      userId: request.userId.toString(),
      name,
      profileImage,
      requestedAt: request.createdAt.toISOString(),
    };
  }
}
