import { injectable } from "inversify";

import { ClientSession, Types, UpdateQuery } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import {
  ISessionRegistration,
  SessionRegistrationModel,
} from "../../../models/sessionRegistration.model";

import { ISessionRegistrationRepository } from "../../interfaces/public/ISessionRegistrationRepository";

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
      .findOne({
        sessionId,
        userId,
      })
      .lean<ISessionRegistration | null>();
  }

  async countActiveRegistrations(sessionId: Types.ObjectId): Promise<number> {
    return this._model.countDocuments({
      sessionId,
      status: "registered",
    });
  }

  async findBySession(
    sessionId: Types.ObjectId,
  ): Promise<ISessionRegistration[]> {
    return this._model
      .find({
        sessionId,
      })
      .sort({
        registeredAt: 1,
      })
      .lean<ISessionRegistration[]>();
  }

  async findByUser(userId: Types.ObjectId): Promise<ISessionRegistration[]> {
    return this._model
      .find({
        userId,
      })
      .sort({
        registeredAt: -1,
      })
      .lean<ISessionRegistration[]>();
  }

  async updateRegistration(
    registrationId: Types.ObjectId,
    update: UpdateQuery<ISessionRegistration>,
    session?: ClientSession,
  ): Promise<ISessionRegistration | null> {
    return this._model
      .findByIdAndUpdate(registrationId, update, {
        new: true,
        session,
      })
      .lean<ISessionRegistration | null>();
  }
}
