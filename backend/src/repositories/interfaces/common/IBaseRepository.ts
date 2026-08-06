import { ClientSession, FilterQuery, Types, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;

  createWithSession(data: Partial<T>, session: ClientSession): Promise<T>;

  findOne(filter: FilterQuery<T>): Promise<T | null>;

  findById(id: string | Types.ObjectId): Promise<T | null>;

  find(filter: FilterQuery<T>): Promise<T[]>;

  updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<number>;

  updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
  ): Promise<T | null>;

  deleteOne(filter: FilterQuery<T>): Promise<boolean>;

  count(filter: FilterQuery<T>): Promise<number>;

  exists(filter: FilterQuery<T>): Promise<boolean>;
}
