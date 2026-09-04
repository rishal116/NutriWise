import { ClientSession, Types, UpdateQuery } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";

import { ISessionRegistration } from "../../../models/sessionRegistration.model";

export interface ISessionRegistrationRepository extends IBaseRepository<ISessionRegistration> {
  findBySessionAndUser(
    sessionId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<ISessionRegistration | null>;

  countActiveRegistrations(sessionId: Types.ObjectId): Promise<number>;

  findBySession(sessionId: Types.ObjectId): Promise<ISessionRegistration[]>;

  findByUser(userId: Types.ObjectId): Promise<ISessionRegistration[]>;

  updateRegistration(
    registrationId: Types.ObjectId,
    update: UpdateQuery<ISessionRegistration>,
    session?: ClientSession,
  ): Promise<ISessionRegistration | null>;
}
