import { SessionRegistrationStatus } from "@/constants/common/session-registration.constants";
import { SessionStatus } from "@/constants/common/session.constants";

export type UserSessionSortBy =
  "upcoming" | "latest" | "oldest" | "title_asc" | "title_desc";

export interface UserSessionListQueryDTO {
  search?: string;
  registrationStatus?: SessionRegistrationStatus;
  sessionStatus?: SessionStatus;
  sortBy?: UserSessionSortBy;
  cursor?: string;
  limit?: number;
}
