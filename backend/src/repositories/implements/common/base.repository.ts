import type {
  ClientSession,
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
} from "mongoose";

import type { IBaseRepository } from "../../interfaces/common/IBaseRepository";

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

    return document.toObject() as T;
  }

  async createMany(data: Partial<T>[], session?: ClientSession): Promise<T[]> {
    const documents = await this._model.insertMany(data, {
      ...(session ? { session } : {}),
    });

    return documents.map((document) => document.toObject() as T);
  }

  async findOne(
    filter: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<T | null> {
    return this._model
      .findOne(filter)
      .session(session ?? null)
      .lean<T | null>()
      .exec();
  }

  async findById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<T | null> {
    return this._model
      .findById(id)
      .session(session ?? null)
      .lean<T | null>()
      .exec();
  }

  async find(filter: FilterQuery<T>, session?: ClientSession): Promise<T[]> {
    return this._model
      .find(filter)
      .session(session ?? null)
      .lean<T[]>()
      .exec();
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<T | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
        ...(session ? { session } : {}),
      })
      .lean<T | null>()
      .exec();
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
      .deleteOne(filter, {
        ...(session ? { session } : {}),
      })
      .exec();

    return result.deletedCount;
  }

  async deleteById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model
      .deleteOne({ _id: id } as FilterQuery<T>, {
        ...(session ? { session } : {}),
      })
      .exec();

    return result.deletedCount;
  }

  async countDocuments(
    filter: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<number> {
    return this._model
      .countDocuments(filter)
      .session(session ?? null)
      .exec();
  }

  async exists(
    filter: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<boolean> {
    return (
      (await this._model
        .exists(filter)
        .session(session ?? null)
        .exec()) !== null
    );
  }
}
