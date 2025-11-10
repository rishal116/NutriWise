import { Document, Model, FilterQuery, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(protected _model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const document = new this._model(data);
    return document.save();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this._model.findOne(filter);
  }

  async findById(id: string): Promise<T | null> {
    return this._model.findById(id);
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this._model.find(filter);
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<number> {
    const result = await this._model.updateOne(filter, update);
    return result.modifiedCount;
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteOne(filter: FilterQuery<T>): Promise<number> {
    const result = await this._model.deleteOne(filter);
    return result.deletedCount ?? 0;
  }
}
