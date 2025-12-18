import { BaseRepository } from "../../implements/base.repository";
import { UserModel, IUser } from "../../../models/user.model";
import { NutritionistDetailsModel, INutritionistProfile,} from "../../../models/nutritionistProfile.model";
import { IUserNutritionistProfileRepository } from "../../interfaces/user/IUserNutritionistProfileRepository";

export class UserNutritionistRepository extends BaseRepository<IUser>implements IUserNutritionistProfileRepository{
  constructor() {
    super(UserModel);
  }

  async findAllNutritionist(): Promise<{ user: IUser; profile: INutritionistProfile }[]> {
    const users = await this._model.find({
      role: "nutritionist",
      nutritionistStatus: "approved",
      isBlocked: false,
    });

    if (!users.length) return [];

    // 2️⃣ Fetch nutritionist profiles
    const userIds = users.map((u) => u._id);

    const profiles = await NutritionistDetailsModel.find({
      userId: { $in: userIds },
    });

    // 3️⃣ Map users
    const userMap = new Map(
      users.map((u) => [u._id.toString(), u])
    );

    // 4️⃣ Combine user + profile
    return profiles
      .filter((p) => userMap.has(p.userId.toString()))
      .map((profile) => ({
        user: userMap.get(profile.userId.toString())!,
        profile,
      }));
  }

  async findByUserId(
    userId: string
  ): Promise<{ user: IUser; profile: INutritionistProfile } | null> {
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
