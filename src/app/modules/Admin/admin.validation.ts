import z from "zod";
import { role } from "./admin.constant";

const createAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string("Phone Number is required"),
    role: z.enum([...role] as [string, ...string[]], {
      error: "role is required",
    }),
    name: z.object({
      firstName: z.string("First name is required"),
      lastName: z.string("Last name is required"),
    }),
    address: z.string("Address is required"),
  }),
});

export const AdminValidation = {
  createAdminZodSchema,
};
