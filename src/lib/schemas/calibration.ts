import { z } from "zod";

export const calibrationSchema = z.object({
  roastLevel: z.enum(["light", "medium", "dark"], {
    required_error: "Please select a roast level",
  }),
  grindSize: z
    .number({
      required_error: "Grind size is required",
    })
    .min(1)
    .max(50),
  dose: z
    .number({
      required_error: "Dose is required",
    })
    .min(5)
    .max(30),
  brewTime: z
    .number({
      required_error: "Brew time is required",
    })
    .min(10)
    .max(60),
  yield: z
    .number({
      required_error: "Yield is required",
    })
    .min(10)
    .max(100),
  tasteBalance: z.number().min(0).max(100),
});

export type CalibrationFormData = z.infer<typeof calibrationSchema>;

export interface CalibrationResult {
  grindAdjustment: string;
  doseAdjustment: string;
  yieldAdjustment: string;
  brewTimeTarget: string;
  explanation: string;
}
