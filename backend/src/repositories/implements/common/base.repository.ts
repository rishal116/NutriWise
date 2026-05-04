import { Model, FilterQuery, UpdateQuery, ClientSession } from "mongoose";
import { IBaseRepository } from "../../interfaces/common/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async create(data: Partial<T>, session?: ClientSession): Promise<T> {
    const docs = await this._model.create([data], { session });
    return docs[0].toObject();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this._model.findOne(filter).lean<T | null>();
  }

  async findById(id: string): Promise<T | null> {
    return this._model.findById(id).lean<T | null>();
  }

  async findByIds(ids: string[]): Promise<T[]> {
    return this._model.find({ _id: { $in: ids } }).lean<T[]>();
  }

  async findAll(filter: FilterQuery<T>): Promise<T[]> {
    return this._model.find(filter).lean<T[]>();
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model.updateOne(filter, update, { session });
    return result.modifiedCount;
  }

  async updateById(
    id: string,
    update: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<T | null> {
    return this._model
      .findByIdAndUpdate(id, update, { new: true, session })
      .lean<T | null>();
  }

  async deleteOne(
    filter: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<number> {
    const result = await this._model.deleteOne(filter, { session });
    return result.deletedCount ?? 0;
  }

  async deleteById(id: string, session?: ClientSession): Promise<number> {
    const result = await this._model.deleteOne({ _id: id }, { session });
    return result.deletedCount ?? 0;
  }
}
