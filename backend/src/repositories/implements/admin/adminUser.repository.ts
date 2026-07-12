import { BaseRepository } from "../common/base.repository";
import { IAdminUserRepository } from "../../interfaces/admin/IAdminUserRepository";
import { UserModel, IUser } from "../../../models/user.model";
import { FilterQuery } from "mongoose";
import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";
import { UserRole } from "../../../enums/user.enum";

export class AdminUserRepository
  extends BaseRepository<IUser>
  implements IAdminUserRepository
{
  constructor() {
    super(UserModel);
  }

  async getUsers(query: AdminUserListQueryDto): Promise<{
    users: IUser[];
    total: number;
  }> {
    const {
      skip,
      limit,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      isBlocked,
    } = query;
    const filter: FilterQuery<IUser> = {
      deletedAt: null,
      roles: {
        $nin: [UserRole.ADMIN],
      },
    };
    if (isBlocked !== undefined) {
      filter.isBlocked = isBlocked;
    }
    const keyword = search?.trim();
    if (keyword) {
      filter.$or = [
        { fullName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { username: { $regex: keyword, $options: "i" } },
      ];
    }
    const [users, total] = await Promise.all([
      this._model
        .find(filter)
        .select(
          "_id fullName email username profileImage activeRole isBlocked isProfileCompleted createdAt",
        )
        .sort({
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit)
        .lean<IUser[]>(),

      this._model.countDocuments(filter),
    ]);
    return {
      users,
      total,
    };
  }

  async updateBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
    await this._model.updateOne(
      { _id: userId },
      {
        $set: {
          isBlocked,
        },
      },
    );
  }

  async addRole(userId: string, role: UserRole): Promise<void> {
    await this._model.updateOne(
      { _id: userId },
      {
        $addToSet: {
          roles: role,
        },
      },
    );
  }
}
