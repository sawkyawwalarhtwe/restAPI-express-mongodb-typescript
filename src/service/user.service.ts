import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { omit } from "lodash";
import UserModel, { UserDocument, UserInput } from "../models/user.model";

export async function createUser(input: UserInput) {

  try {
    const user = await UserModel.create(input);

    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}
export async function checkUserRole(role: string){

  if(role === "SUPER_ADMIN") return [{role: "SUPER_ADMIN"}, {role: "ADMIN1"}, {role: "ADMIN2"}, {role:"DISTRIBUTOR"}, {role:"USER"}];
  else if(role === "ADMIN1") return [{role: "ADMIN1"}, {role: "ADMIN2"}, {role:"DISTRIBUTOR"}, {role:"USER"}];
  else if(role === "ADMIN2") return [{role:"DISTRIBUTOR"}, {role:"USER"}];
  else if(role === "DISTRIBUTOR") return [{role:"USER"}];
  else return null;
  
}
export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

export async function findUsers(query: FilterQuery<UserDocument>) {
  return UserModel.find(query).lean();
}

export async function findAndUpdateUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions
) {
  return UserModel.findOneAndUpdate(query, update, options);
}