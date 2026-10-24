import type { ClientSession, FilterQuery, Types, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>, session?: ClientSession): Promise<T>;

  findOne(filter: FilterQuery<T>): Promise<T | null>;

  findById(id: string | Types.ObjectId): Promise<T | null>;

  find(filter: FilterQuery<T>): Promise<T[]>;

  updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<T | null>;

  updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<number>;

  deleteOne(filter: FilterQuery<T>, session?: ClientSession): Promise<number>;

  countDocuments(filter: FilterQuery<T>): Promise<number>;

  exists(filter: FilterQuery<T>): Promise<boolean>;
}
