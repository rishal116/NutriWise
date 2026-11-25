import { injectable } from "inversify";
import { Types, type ClientSession, type UpdateQuery } from "mongoose";

import { BaseRepository } from "../common/base.repository";
import {
  SessionRegistrationModel,
  type ISessionRegistration,
} from "../../../models/sessionRegistration.model";
import type { ISessionRegistrationRepository } from "../../interfaces/public/ISessionRegistrationRepository";

@injectable()
export class SessionRegistrationRepository
  extends BaseRepository<ISessionRegistration>
  implements ISessionRegistrationRepository
{
  constructor() {
    super(SessionRegistrationModel);
  }

  async findBySessionAndUser(
    sessionId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<ISessionRegistration | null> {
    return this.findOne({ sessionId, userId }, session);
  }

  async countActiveRegistrations(
    sessionId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    return this._model
      .countDocuments({
        sessionId,
        status: "registered",
      })
      .session(session ?? null)
      .exec();
  }

  async findBySession(
    sessionId: Types.ObjectId,
  ): Promise<ISessionRegistration[]> {
    return this.find({ sessionId }, undefined, { registeredAt: 1 });
  }

  async findByUser(userId: Types.ObjectId): Promise<ISessionRegistration[]> {
    return this.find({ userId }, undefined, { registeredAt: -1 });
  }

  async updateRegistration(
    registrationId: Types.ObjectId,
    update: UpdateQuery<ISessionRegistration>,
    session?: ClientSession,
  ): Promise<ISessionRegistration | null> {
    return this._model
      .findByIdAndUpdate(registrationId, update, {
        new: true,
        ...(session ? { session } : {}),
      })
      .lean<ISessionRegistration | null>()
      .exec();
  }
}
