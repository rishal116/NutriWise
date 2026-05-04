import { ISession } from "../../models/session.model";
import { SessionResponseDTO } from "../../dtos/nutritionist/session.dto";

export class SessionMapper {
  static toResponse(session: ISession): SessionResponseDTO {
    return {
      id: session._id.toString(),
      title: session.title,
      description: session.description,
      type: session.type,
      roomId:session.roomId,
      price: session.price || 0,
      scheduledAt: session.scheduledAt,
      durationInMinutes: session.durationInMinutes,
      status: session.status,
      maxParticipants: session.maxParticipants,
      createdAt: session.createdAt,
    };
  }

  static toResponseList(sessions: ISession[]): SessionResponseDTO[] {
    return sessions.map(this.toResponse);
  }
}