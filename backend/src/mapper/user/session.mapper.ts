import { ISession } from "../../models/session.model";
import {
  UserSessionListDTO,
  UserSessionDetailsDTO,
} from "../../dtos/user/session.dto";

import { PopulatedSession } from "../../types/session.populated";

export class UserSessionMapper {
  static toListResponse(
    session: ISession,
    joinedUsersCount: number,
  ): UserSessionListDTO {
    return {
      id: session._id.toString(),
      title: session.title,
      description: session.description,
      scheduledAt: session.scheduledAt,
      durationInMinutes: session.durationInMinutes,
      type: session.type,
      price: session.price || 0,
      status: session.status,
      joinedUsersCount,
      maxParticipants: session.maxParticipants,
    };
  }

  static toDetailsResponse(
    session: PopulatedSession,
    joinedUsersCount: number,
    users: {
      id: string;
      name: string;
      email: string;
    }[],
  ): UserSessionDetailsDTO {
    return {
      id: session._id.toString(),
      title: session.title,
      description: session.description,
      scheduledAt: session.scheduledAt,
      durationInMinutes: session.durationInMinutes,
      type: session.type,
      price: session.price || 0,
      status: session.status,
      roomId: session.roomId,
      joinedUsersCount,
      maxParticipants: session.maxParticipants,
      nutritionist: {
        id: session.nutritionistId._id.toString(),
        name: session.nutritionistId.fullName,
        email: session.nutritionistId.email,
      },
      users,
    };
  }

  static toListResponseArray(
    sessions: ISession[],
    participantCountMap: Map<string, number>,
  ): UserSessionListDTO[] {
    return sessions.map((session) =>
      this.toListResponse(
        session,
        participantCountMap.get(session._id.toString()) || 0,
      ),
    );
  }
}