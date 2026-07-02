import { UserModel } from "../models/user.model";

export const generateUniqueUsername = async (
  fullName: string,
): Promise<string> => {
  const baseUsername = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  let username = baseUsername;
  let counter = 1;

  while (await UserModel.exists({ username })) {
    username = `${baseUsername}-${counter}`;
    counter++;
  }

  return username;
};
