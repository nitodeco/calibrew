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

  // Helper function to analyze brew time
  const getBrewTimeAssessment = (time: number) => {
    if (time < 25) return "too fast";
    if (time > 32) return "too slow";
    return "good";
  };

  // Analyze current parameters
  const brewSpeed = getBrewTimeAssessment(brewTime);
  const isGrindTooCoarse = grindSize > 30;
  const isGrindTooFine = grindSize < 10;

  // Taste is too sour (under-extracted) - balance < 40
  if (tasteBalance < 40) {
    const brewTimeMsg =
      brewSpeed === "too fast" ? "Your shot is running too fast. " : "";

    adjustments = {
      grindAdjustment: `Grind finer by ${
        isGrindTooFine ? "1-2" : "2-3"
      } settings`,
      doseAdjustment: "Reduce dose by 0.5g",
      yieldAdjustment: "Increase yield by 2g",
      brewTimeTarget: "Aim for 28-32 seconds",
      explanation: `${brewTimeMsg}Your coffee is under-extracted. We recommend grinding finer and slightly reducing the dose to improve extraction.`,
    };
  }
  // Taste is too bitter (over-extracted) - balance > 60
  else if (tasteBalance > 60) {
    const brewTimeMsg =
      brewSpeed === "too slow" ? "Your shot is running too slow. " : "";

    adjustments = {
      grindAdjustment: `Grind coarser by ${
        isGrindTooCoarse ? "1-2" : "2-3"
      } settings`,
      doseAdjustment: "Increase dose by 0.5g",
      yieldAdjustment: "Reduce yield by 2g",
      brewTimeTarget: "Aim for 25-28 seconds",
      explanation: `${brewTimeMsg}Your coffee is over-extracted. We recommend grinding coarser and slightly increasing the dose to reduce extraction.`,
    };
  }
  // Balanced but might need fine-tuning
  else {
    let finetuneMsg = "";
    if (brewSpeed !== "good") {
      finetuneMsg =
        brewSpeed === "too fast"
          ? " Consider a slightly finer grind to slow down the shot."
          : " Consider a slightly coarser grind to speed up the shot.";
    }

    adjustments = {
      grindAdjustment:
        brewSpeed === "good"
          ? "Current grind size is good"
          : `Try ${
              brewSpeed === "too fast" ? "finer" : "coarser"
            } by 1 setting`,
      doseAdjustment: "Current dose is good",
      yieldAdjustment: `Maintain current ratio of 1:${ratio.toFixed(1)}`,
      brewTimeTarget:
        brewSpeed === "good"
          ? "Current brew time is good"
          : `Aim for 25-32 seconds (currently ${brewTime}s)`,
      explanation: `Your parameters are well balanced!${finetuneMsg} Make minor adjustments based on taste preferences.`,
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
