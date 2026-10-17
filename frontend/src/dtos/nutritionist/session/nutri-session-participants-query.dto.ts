export interface NutriSessionParticipantsQueryDTO {
  search?: string;
  status?: "registered" | "cancelled" | "attended" | "absent";
  paymentStatus?: "not_required" | "pending" | "paid" | "failed" | "refunded";
  cursor?: string;
  limit?: number;
}
