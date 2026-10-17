export interface NutriSessionParticipantResponseDTO {
  registrationId: string;
  userId: string;
  fullName: string;
  username: string;
  profileImage?: string;
  status: "registered" | "cancelled" | "attended" | "absent";
  paymentStatus: "not_required" | "pending" | "paid" | "failed" | "refunded";
  registeredAt: string;
}
