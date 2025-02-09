import { z } from "zod";

export const Range = z
  .object({
    min: z.union([z.string(), z.number()]),
    max: z.union([z.string(), z.number()]),
    default: z.union([z.string(), z.number()]).optional(),
  })
  .refine((data) => typeof data.min === typeof data.max, {
    message: "Both min and max must be the same type",
  });
export type Range = z.infer<typeof Range>;
