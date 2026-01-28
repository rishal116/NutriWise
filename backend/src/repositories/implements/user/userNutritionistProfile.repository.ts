import { BaseRepository } from "../common/base.repository";
import { UserModel, IUser } from "../../../models/user.model";
import { NutritionistDetailsModel, INutritionistProfile,} from "../../../models/nutritionistProfile.model";
import { IUserNutritionistProfileRepository } from "../../interfaces/user/IUserNutritionistProfileRepository";
import { NutritionistListFilter,NutritionistRepoResult } from "../../../dtos/user/nutritionistUser.dto";
import { FilterQuery } from "mongoose";

export class UserNutritionistRepository extends BaseRepository<IUser>implements IUserNutritionistProfileRepository{
  constructor() {
    super(UserModel);
  }
  
async findAllNutritionist(filters: NutritionistListFilter) {
  const { page, limit, search, specializations } = filters;

  const userQuery: FilterQuery<IUser> = {
    role: "nutritionist",
    nutritionistStatus: "approved",
    isBlocked: false,
  };

  if (search) {
    userQuery.fullName = { $regex: search, $options: "i" };
  }

  // STEP 1: If specialization filter exists, get matching userIds first
  let userIdsBySpecialization: string[] | undefined;

  if (specializations) {
    const profiles = await NutritionistDetailsModel.find(
      { specializations },
      { userId: 1 }
    );

    userIdsBySpecialization = profiles.map(p => p.userId.toString());

    // If no matching profiles → return empty
    if (!userIdsBySpecialization.length) {
      return { data: [], total: 0 };
    }

    userQuery._id = { $in: userIdsBySpecialization };
  }

  // STEP 2: Count AFTER all filters
  const total = await this._model.countDocuments(userQuery);

  // STEP 3: Apply pagination AFTER filters
  const users = await this._model
    .find(userQuery)
    .skip((page - 1) * limit)
    .limit(limit);

  if (!users.length) return { data: [], total };

  // STEP 4: Fetch profiles only for paginated users
  const profiles = await NutritionistDetailsModel.find({
    userId: { $in: users.map(u => u._id) },
  });

  const userMap = new Map(users.map(u => [u._id.toString(), u]));

  const data = profiles.map(profile => ({
    user: userMap.get(profile.userId.toString())!,
    profile,
  }));

  return { data, total };
}


  
  async findByUserId(userId: string): Promise<{ user: IUser; profile: INutritionistProfile } | null> {
    const user = await this._model.findOne({
      _id: userId,
      role: "nutritionist",
      nutritionistStatus: "approved",
      isBlocked: false,
    });
    if (!user) return null;
    const profile = await NutritionistDetailsModel.findOne({ userId });
    if (!profile) return null;

    return { user, profile };
  }
}
