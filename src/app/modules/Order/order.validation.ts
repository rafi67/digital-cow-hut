import z from "zod";

const createOrderZodSchema = z.object({
  body: z.object({
    cow: z.string("Cow is required"),
    buyer: z.string("Buyer is required"),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
