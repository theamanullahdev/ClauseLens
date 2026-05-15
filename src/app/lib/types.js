// Type definitions for ClauseLens

export const RISK_LEVELS = {
  CRITICAL: "CRITICAL",
  MODERATE: "MODERATE",
  MINOR: "MINOR",
};

export const OVERALL_RISK = {
  HIGH: "HIGH",
  MODERATE: "MODERATE",
  LOW: "LOW",
};

export const CHANGE_TYPE = {
  ADDITION: "addition",
  REMOVAL: "removal",
  MODIFICATION: "modification",
};

export const RECOMMENDATION = {
  REJECT: "Reject",
  NEGOTIATE: "Negotiate",
  ACCEPTABLE: "Acceptable",
};

// Risk level color mapping
export const getRiskColor = (level) => {
  switch (level) {
    case RISK_LEVELS.CRITICAL:
      return "text-red-500";
    case RISK_LEVELS.MODERATE:
      return "text-yellow-500";
    case RISK_LEVELS.MINOR:
      return "text-blue-500";
    default:
      return "text-neutral-400";
  }
};

export const getRiskBgColor = (level) => {
  switch (level) {
    case RISK_LEVELS.CRITICAL:
      return "bg-red-500/10 border-red-500/30";
    case RISK_LEVELS.MODERATE:
      return "bg-yellow-500/10 border-yellow-500/30";
    case RISK_LEVELS.MINOR:
      return "bg-blue-500/10 border-blue-500/30";
    default:
      return "bg-neutral-500/10 border-neutral-500/30";
  }
};

export const getRecommendationColor = (rec) => {
  switch (rec) {
    case RECOMMENDATION.REJECT:
      return "text-red-400";
    case RECOMMENDATION.NEGOTIATE:
      return "text-yellow-400";
    case RECOMMENDATION.ACCEPTABLE:
      return "text-green-400";
    default:
      return "text-neutral-400";
  }
};
