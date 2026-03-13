import z from "zod";

const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string("Phone number is required"),
    password: z.string("Password is required"),
  }),
});

export const AuthValidation = {
  loginZodSchema,
};
