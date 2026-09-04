export type SessionRegistrationStatus =
  | "registered"
  | "cancelled"
  | "attended"
  | "absent";

export type SessionPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export class SessionRegistrationResponseDTO {
  id!: string;

  sessionId!: string;

  userId!: string;

  status!: SessionRegistrationStatus;

  paymentStatus!: SessionPaymentStatus;

  registeredAt!: Date;

  cancelledAt?: Date;

  attendedAt?: Date;

  createdAt!: Date;

  updatedAt!: Date;
}