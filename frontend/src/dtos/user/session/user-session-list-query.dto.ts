
import type {
  UserSessionPaymentStatus,
  UserSessionRegistrationStatus,
  UserSessionStatus,
  UserSessionType,
} from "./user-session.dto";

export type UserSessionSortBy =
  | "upcoming"
  | "latest"
  | "oldest"
  | "title_asc"
  | "title_desc";

export interface UserSessionListQueryDTO {
  search?: string;
  registrationStatus?: UserSessionRegistrationStatus;
  paymentStatus?: UserSessionPaymentStatus;
  sessionType?: UserSessionType;
  sessionStatus?: UserSessionStatus;
  sortBy?: UserSessionSortBy;
  cursor?: string;
  limit?: number;
}
