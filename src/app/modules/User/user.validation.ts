import z from "zod";
import { role } from "./user.constant";

const createUserZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string("required"),
    role: z.enum([...role] as [string, ...string[]], {
      error: "Role is required",
    }),
    password: z.string("Password is required"),
    name: z.object({
      firstName: z.string("First name is required"),
      lastName: z.string("Last name is required"),
    }),
    address: z.string("Address is required"),
    budget: z.string("Type error").optional(),
    income: z.string("Type error").optional(),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string("Type error").optional(),
    role: z
      .enum([...role] as [string, ...string[]], {
        error: "Type error",
      })
      .optional(),
    password: z.string("Type error").optional(),
    name: z
      .object({
        firstName: z.string("Type error").optional(),
        lastName: z.string("Type error").optional(),
      })
      .optional(),
    address: z.string("Type error").optional(),
    budget: z.string("Type error").optional(),
    income: z.string("Type error").optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
