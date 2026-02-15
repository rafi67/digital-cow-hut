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
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
