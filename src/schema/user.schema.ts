import mongoose from "mongoose";
import { number, object, string, TypeOf, ZodType } from "zod";

type userRole = "SUPER_ADMIN" | "ADMIN1" | "ADMIN2" | "Distributor" | "USER";
const payload = {
  body: object({

    clusterUrl: string(),
  }),
};


export const createUserSchema = object({
    body: object({
      name: string({
        required_error: "Name is required",
      }),
      password: string({
        required_error: "Name is required",
      }).min(6, "Password too short - should be 6 chars minimum"),
      passwordConfirmation: string({
        required_error: "passwordConfirmation is required",
      }),
      email: string({
        required_error: "Email is required",
      }).email("Not a valid email"),
      phone: number(),
      role: string() ,
      clusterUrl: string(),
      dist: string()
    }).refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords do not match",
      path: ["passwordConfirmation"],
    }),
  });


  export const updateUserSchema = object({
    ...payload,
  });

  export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;