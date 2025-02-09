import { z } from "zod";

export const calibrationSchema = z.object({
  roastLevel: z.number().min(0).max(100),
  grindSize: z.number().positive(),
  dose: z.number().positive(),
  brewTime: z.number().positive(),
  yield: z.number().positive(),
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
