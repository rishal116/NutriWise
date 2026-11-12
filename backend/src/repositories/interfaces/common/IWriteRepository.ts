import type { ClientSession, FilterQuery, Types, UpdateQuery } from "mongoose";

export interface IWriteRepository<T> {
  create(data: Partial<T>, session?: ClientSession): Promise<T>;

  createMany(data: Partial<T>[], session?: ClientSession): Promise<T[]>;

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

  deleteById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number>;
}
