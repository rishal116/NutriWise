import { Model, FilterQuery, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this._model.create(data);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this._model.findOne(filter).lean<T | null>();
  }

  async findById(id: string): Promise<T | null> {
    return this._model.findById(id).lean<T | null>();
  }

  async findAll(filter: FilterQuery<T>): Promise<T[]> {
    return this._model.find(filter).lean<T[]>();
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<number> {
    const result = await this._model.updateOne(filter, update);
    return result.modifiedCount;
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, update, { new: true }).lean<T | null>();
  }

  async deleteOne(filter: FilterQuery<T>): Promise<number> {
    const result = await this._model.deleteOne(filter);
    return result.deletedCount ?? 0;
  }
}
