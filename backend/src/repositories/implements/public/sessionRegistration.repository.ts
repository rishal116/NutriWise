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
  ): Promise<ISessionRegistration | null> {
    return this._model
      .findOne({ sessionId, userId })
      .lean<ISessionRegistration | null>()
      .exec();
  }

  async countActiveRegistrations(sessionId: Types.ObjectId): Promise<number> {
    return this._model
      .countDocuments({
        sessionId,
        status: "registered",
      })
      .exec();
  }

  async findBySession(
    sessionId: Types.ObjectId,
  ): Promise<ISessionRegistration[]> {
    return this._model
      .find({ sessionId })
      .sort({ registeredAt: 1 })
      .lean<ISessionRegistration[]>()
      .exec();
  }

  async findByUser(userId: Types.ObjectId): Promise<ISessionRegistration[]> {
    return this._model
      .find({ userId })
      .sort({ registeredAt: -1 })
      .lean<ISessionRegistration[]>()
      .exec();
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
