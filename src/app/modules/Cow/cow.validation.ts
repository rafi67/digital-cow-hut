import z from "zod";
import { breed, category, label, location } from "./cow.constant";

const createCowZodSchema = z.object({
  body: z.object({
    name: z.string("Name is required"),
    age: z.string("Age is required"),
    price: z.string("Price is required"),
    location: z.enum([...location] as [string, ...string[]], {
      error: "Location is required",
    }),
    breed: z.enum([...breed] as [string, ...string[]], {
      error: "Breed is required",
    }),
    weight: z.string("Weight is required"),
    label: z.enum([...label] as [string, ...string[]], {
      error: "Label is required",
    }),
    category: z.enum([...category] as [string, ...string[]], {
      error: "Category is required",
    }),
    seller: z.string("Seller is required"),
  }),
});

const updateCowZodSchema = z.object({
  body: z.object({
    name: z.string("Type error").optional(),
    age: z.string("Type error").optional(),
    price: z.string("Type error").optional(),
    location: z
      .enum([...location] as [string, ...string[]], {
        error: "Location is required",
      })
      .optional(),
    breed: z
      .enum([...breed] as [string, ...string[]], {
        error: "Bread is required",
      })
      .optional(),
    weight: z.string("Type error").optional(),
    label: z
      .enum([...label] as [string, ...string[]], {
        error: "Label is required",
      })
      .optional(),
    category: z
      .enum([...category] as [string, ...string[]], {
        error: "Category is required",
      })
      .optional(),
    seller: z.string("Type error").optional(),
  }),
});

export const CowValidation = {
  createCowZodSchema,
  updateCowZodSchema,
};
