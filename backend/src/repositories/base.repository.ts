import { Document, Model, FilterQuery, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  // ✅ Create a new document
  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }

  // ✅ Find one document by filter
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  // ✅ Find by ID
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  // ✅ Update one document by filter
  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<void> {
    await this.model.updateOne(filter, update);
  }

  // ✅ Update by ID and return the updated document
  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  // ✅ Delete one by filter
  async deleteOne(filter: FilterQuery<T>): Promise<void> {
    await this.model.deleteOne(filter);
  }
}

