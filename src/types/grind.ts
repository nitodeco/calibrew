import { z } from "zod";

export const GrindType = z.enum(["absolute", "stepped", "clicks"]);
export type GrindType = z.infer<typeof GrindType>;

export const GrindUnit = z.enum(["numbers", "letters"]);
export type GrindUnit = z.infer<typeof GrindUnit>;

const numberValue = z
  .number({
    required_error: "Value is required",
    invalid_type_error: "Value must be a number",
  })
  .nonnegative({ message: "Value must be 0 or greater" })
  .max(65535, { message: "Value cannot exceed 65535" });

const letterValue = z
  .string({
    required_error: "Value is required",
    invalid_type_error: "Value must be a letter",
  })
  .length(1, { message: "Must be a single letter" })
  .regex(/^[A-Z]$/, { message: "Must be an uppercase letter (A-Z)" });

const baseSchema = z.object({
  type: z.enum(["absolute", "stepped", "clicks"], {
    required_error: "Grinder type is required",
    invalid_type_error: "Invalid grinder type",
  }),
});

export const GrindSetting = z.union([
  baseSchema.extend({
    type: z.literal("absolute"),
    stepSize: z
      .number({
        required_error: "Step size is required",
        invalid_type_error: "Step size must be a number",
      })
      .positive({ message: "Step size must be a positive number" })
      .max(10, { message: "Step size cannot be larger than 10" })
      .default(1),
  }),
  baseSchema
    .extend({
      type: z.literal("stepped"),
      unit: GrindUnit,
      minValue: z.union([numberValue, letterValue], {
        invalid_type_error: "Invalid minimum value type",
      }),
      maxValue: z.union([numberValue, letterValue], {
        invalid_type_error: "Invalid maximum value type",
      }),
    })
    .refine(
      (data) => {
        if (data.unit === "numbers") {
          return (data.maxValue as number) > (data.minValue as number);
        }
        return (
          (data.maxValue as string).charCodeAt(0) >
          (data.minValue as string).charCodeAt(0)
        );
      },
      {
        message: "Maximum value must be greater than minimum value",
        path: ["maxValue"],
      }
    ),
  baseSchema.extend({
    type: z.literal("clicks"),
  }),
]);

export type GrindSetting = z.infer<typeof GrindSetting>;
