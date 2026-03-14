import z from "zod";

const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string("Phone number is required"),
    password: z.string("Password is required"),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string("Refresh Token is required"),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
};
