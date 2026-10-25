import type { ISession, SessionStatus, SessionType, SessionPricingType } from "../../../../models/session.model";
import type {
  ISessionRegistration,
  SessionRegistrationStatus,
  SessionRegistrationPaymentStatus,
} from "../../../../models/session-registration.model";

export interface IAdminSessionFilters {
  search?: string;
  type?: SessionType;
  pricingType?: SessionPricingType;
  status?: SessionStatus;
  fromDate?: Date;
  toDate?: Date;
  page: number;
  limit: number;
}

export interface IAdminSessionListResult {
  sessions: ISession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IAdminSessionRegistrationFilters {
  status?: SessionRegistrationStatus;
  paymentStatus?: SessionRegistrationPaymentStatus;
  page: number;
  limit: number;
}

export interface IAdminSessionRegistrationListResult {
  registrations: ISessionRegistration[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IAdminSessionRegistrationSummary {
  total: number;
  registered: number;
  cancelled: number;
  attended: number;
  absent: number;
  paymentPending: number;
  paymentPaid: number;
  paymentFailed: number;
  paymentRefunded: number;
}

export interface IAdminSessionRepository {
  findAll(
    filters: IAdminSessionFilters,
  ): Promise<IAdminSessionListResult>;

  findById(sessionId: string): Promise<ISession | null>;

  findRegistrations(
    sessionId: string,
    filters: IAdminSessionRegistrationFilters,
  ): Promise<IAdminSessionRegistrationListResult>;

  getRegistrationSummary(
    sessionId: string,
  ): Promise<IAdminSessionRegistrationSummary>;
}