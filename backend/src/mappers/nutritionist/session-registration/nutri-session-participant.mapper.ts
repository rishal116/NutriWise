import type { INutriSessionParticipantProjection } from "../../../types/nutritionist/session-registration/nutri-session-participant.projection";
import type { NutriSessionParticipantDTO } from "../../../dtos/nutritionist/session-registration/nutri-session-participant.dto";

export const mapNutriSessionParticipant = (
  participant: INutriSessionParticipantProjection,
): NutriSessionParticipantDTO => ({
  registrationId: participant.registrationId.toString(),
  userId: participant.userId.toString(),
  fullName: participant.fullName,
  username: participant.username,
  profileImage: participant.profileImage,
  status: participant.status,
  paymentStatus: participant.paymentStatus,
  registeredAt: participant.registeredAt,
});
