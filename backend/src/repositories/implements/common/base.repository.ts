import {
  ClientSession,
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
} from "mongoose";

import { IBaseRepository } from "../../interfaces/common/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected readonly _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this._model.create(data);
  }

  async createWithSession(
    data: Partial<T>,
    session: ClientSession,
  ): Promise<T> {
    const [document] = await this._model.create([data], { session });

    return document;
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this._model.findOne(filter).lean<T | null>();
  }

  async findById(id: string | Types.ObjectId): Promise<T | null> {
    return this._model.findById(id).lean<T | null>();
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return this._model.find(filter).lean<T[]>();
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<number> {
    const result = await this._model.updateOne(filter, update);

    return result.modifiedCount;
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
      })
      .lean<T | null>();
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this._model.deleteOne(filter);

    return result.deletedCount > 0;
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    return this._model.countDocuments(filter);
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    return (await this._model.exists(filter)) !== null;
  }
}
