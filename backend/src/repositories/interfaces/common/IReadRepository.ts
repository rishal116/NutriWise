import type { ClientSession, FilterQuery, Types } from "mongoose";

export interface IReadRepository<T> {
  findOne(filter: FilterQuery<T>, session?: ClientSession): Promise<T | null>;

  findById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<T | null>;

  find(filter: FilterQuery<T>, session?: ClientSession): Promise<T[]>;

  countDocuments(
    filter: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<number>;

  exists(filter: FilterQuery<T>, session?: ClientSession): Promise<boolean>;
}
