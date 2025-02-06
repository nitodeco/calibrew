"use server";

import {
  calibrationSchema,
  type CalibrationFormData,
  type CalibrationResult,
} from "@/lib/schemas/calibration";

export async function calculateCalibration(
  params: CalibrationFormData
): Promise<CalibrationResult> {
  // Validate input data
  const validatedData = calibrationSchema.parse(params);
  const {
    roastLevel,
    grindSize,
    dose,
    brewTime,
    yield: coffeeYield,
    tasteBalance,
  } = validatedData;

  // Calculate extraction ratio
  const ratio = coffeeYield / dose;

  // Base adjustments on taste balance and current parameters
  let adjustments: CalibrationResult = {
    grindAdjustment: "",
    doseAdjustment: "",
    yieldAdjustment: "",
    brewTimeTarget: "",
    explanation: "",
  };

  // Taste is too sour (under-extracted) - balance < 40
  if (tasteBalance < 40) {
    adjustments = {
      grindAdjustment: "Grind finer by 2-3 settings",
      doseAdjustment: "Reduce dose by 0.5g",
      yieldAdjustment: "Increase yield by 2g",
      brewTimeTarget: "Aim for 28-32 seconds",
      explanation:
        "Your coffee is under-extracted. We recommend grinding finer and slightly reducing the dose to improve extraction.",
    };
  }
  // Taste is too bitter (over-extracted) - balance > 60
  else if (tasteBalance > 60) {
    adjustments = {
      grindAdjustment: "Grind coarser by 2-3 settings",
      doseAdjustment: "Increase dose by 0.5g",
      yieldAdjustment: "Reduce yield by 2g",
      brewTimeTarget: "Aim for 25-28 seconds",
      explanation:
        "Your coffee is over-extracted. We recommend grinding coarser and slightly increasing the dose to reduce extraction.",
    };
  }
  // Balanced but might need fine-tuning
  else {
    adjustments = {
      grindAdjustment: "Current grind size is good",
      doseAdjustment: "Current dose is good",
      yieldAdjustment: `Maintain current ratio of 1:${ratio.toFixed(1)}`,
      brewTimeTarget: "Current brew time is good",
      explanation:
        "Your parameters are well balanced! Make minor adjustments based on taste preferences.",
    };
  }

  // Roast-specific adjustments
  if (roastLevel === "light") {
    adjustments.explanation +=
      " Light roasts typically benefit from higher temperatures and longer ratios.";
  } else if (roastLevel === "dark") {
    adjustments.explanation +=
      " Dark roasts typically benefit from lower temperatures and shorter ratios.";
  }

  return adjustments;
}
