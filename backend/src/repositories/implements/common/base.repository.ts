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

  async create(data: Partial<T>, session?: ClientSession): Promise<T> {
    const [document] = await this._model.create(
      [data],
      session ? { session } : undefined,
    );

    return document;
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this._model.findOne(filter).lean<T | null>().exec();
  }

  async findById(id: string | Types.ObjectId): Promise<T | null> {
    return this._model.findById(id).lean<T | null>().exec();
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return this._model.find(filter).lean<T[]>().exec();
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<T | null> {
    const query = this._model.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      ...(session ? { session } : {}),
    });

    return query.lean<T | null>().exec();
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model
      .updateOne(filter, update, {
        runValidators: true,
        ...(session ? { session } : {}),
      })
      .exec();

    return result.modifiedCount;
  }

  async deleteOne(
    filter: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model
      .deleteOne(filter, session ? { session } : {})
      .exec();

    return result.deletedCount;
  }

  async countDocuments(filter: FilterQuery<T>): Promise<number> {
    return this._model.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    return (await this._model.exists(filter).exec()) !== null;
  }
}
