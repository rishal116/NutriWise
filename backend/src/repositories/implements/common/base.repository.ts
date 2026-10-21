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
    return this._model.findOne(filter).lean<T | null>().exec();
  }

  async findById(id: string | Types.ObjectId): Promise<T | null> {
    return this._model.findById(id).lean<T | null>().exec();
  }

  async findByIds(ids: (string | Types.ObjectId)[]): Promise<T[]> {
    return this._model
      .find({ _id: { $in: ids } } as FilterQuery<T>)
      .lean<T[]>()
      .exec();
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return this._model.find(filter).lean<T[]>().exec();
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<number> {
    const query = this._model.updateOne(filter, update, {
      runValidators: true,
    });

    if (session) {
      query.session(session);
    }

    const result = await query.exec();

    return result.modifiedCount;
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .lean<T | null>()
      .exec();
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this._model.deleteOne(filter).exec();

    return result.deletedCount > 0;
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    return this._model.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    return (await this._model.exists(filter).exec()) !== null;
  }
}
