/**
 * CivicGuard AI Engine - Intelligent Infrastructure Analytics & Verification
 */

/**
 * Calculates a comprehensive AI Severity Score (0-100) based on multi-factor analysis
 */
export function calculateAISeverityScore(params) {
  const {
    category = "Pothole",
    confirmations = 1,
    trafficDensity = "High", // High, Medium, Low
    isNearSensitiveZone = false, // School, Hospital, Bus station
    weatherImpact = "Moderate", // Severe, Moderate, Low
    daysUnresolved = 1,
    sizeSeverity = "High" // Critical, High, Medium, Low
  } = params;

  let score = 30; // Base baseline

  // Factor 1: Category Intrinsic Hazard Weight
  const categoryWeights = {
    "Pothole": 25,
    "Fallen tree/road obstruction": 30,
    "Overflowing drain": 25,
    "Damaged traffic sign": 22,
    "Broken streetlight": 18,
    "Road crack": 12,
    "Damaged road": 20,
    "Blocked drain": 18,
    "Garbage accumulation": 10,
    "Other infrastructure issue": 12
  };
  score += categoryWeights[category] || 15;

  // Factor 2: Traffic & Location Density Impact
  if (trafficDensity === "High") score += 18;
  else if (trafficDensity === "Medium") score += 10;
  else score += 4;

  // Factor 3: Proximity to Critical Infrastructure (Schools, Hospitals)
  if (isNearSensitiveZone) score += 15;

  // Factor 4: Public Confirmation Escalation (+2 per 5 upvotes, max +15)
  const confirmationBonus = Math.min(15, Math.floor(confirmations / 3) * 2);
  score += confirmationBonus;

  // Factor 5: Weather Risk Forecast Factor
  if (weatherImpact === "Severe") score += 12;
  else if (weatherImpact === "Moderate") score += 6;

  // Factor 6: Time Unresolved Aging Factor (+2 per day, max +10)
  const agingBonus = Math.min(10, daysUnresolved * 2);
  score += agingBonus;

  // Cap between 0 and 100
  const finalScore = Math.min(99, Math.max(15, Math.round(score)));

  let severityLevel = "LOW";
  if (finalScore >= 85) severityLevel = "CRITICAL";
  else if (finalScore >= 65) severityLevel = "HIGH";
  else if (finalScore >= 40) severityLevel = "MEDIUM";

  return {
    score: finalScore,
    severityLevel,
    factors: {
      categoryWeight: categoryWeights[category] || 15,
      trafficDensity,
      sensitiveZone: isNearSensitiveZone ? "+15 pts (Sensitive Zone)" : "Normal",
      confirmationBonus: `+${confirmationBonus} pts (${confirmations} confirmed)`,
      weatherFactor: weatherImpact,
      agingBonus: `+${agingBonus} pts (${daysUnresolved} days)`
    }
  };
}

/**
 * Predicts early risk warnings before complete infrastructure failure
 */
export function generatePredictiveRiskAnalysis(category, severityScore) {
  if (category === "Road crack") {
    return {
      hasRisk: true,
      riskLevel: severityScore > 60 ? "HIGH" : "MEDIUM",
      predictedOutcome: "Water freeze-thaw expansion will widen fissures, leading to full asphalt sub-base breakdown within 14-21 days.",
      preventiveCost: "$140 (Polymer seal)",
      failureCost: "$3,800 (Excavation & resurfacing)",
      recommendedAction: "Schedule preventive surface seal before upcoming rain forecast."
    };
  } else if (category === "Blocked drain" || category === "Overflowing drain") {
    return {
      hasRisk: true,
      riskLevel: "CRITICAL",
      predictedOutcome: "Severe storm surge blockage will cause localized street flash flooding and sewer backflow into surrounding basements.",
      preventiveCost: "$220 (Gully vacuuming)",
      failureCost: "$28,000 (Water damage claims & road repair)",
      recommendedAction: "Emergency clearance of intake grates prior to thunderstorm."
    };
  } else if (category === "Pothole") {
    return {
      hasRisk: true,
      riskLevel: severityScore > 80 ? "CRITICAL" : "HIGH",
      predictedOutcome: "Vehicle impact cycles will strip rebar structural integrity, expanding pothole width by 40% per week.",
      preventiveCost: "$320 (Hot asphalt patch)",
      failureCost: "$6,500 (Full lane section replacement)",
      recommendedAction: "Dispatch rapid hot-mix asphalt patching crew."
    };
  }

  return {
    hasRisk: false,
    riskLevel: "LOW",
    predictedOutcome: "Standard maintenance monitoring required.",
    preventiveCost: "$100",
    failureCost: "$100",
    recommendedAction: "Monitor during next routine inspection."
  };
}

/**
 * Checks for duplicate reports based on visual category & geographical proximity (< 150 meters)
 */
export function checkForDuplicateReport(newIssue, existingIssues) {
  const DUPLICATE_RADIUS_KM = 0.15; // 150 meters

  for (const issue of existingIssues) {
    if (issue.status === "RESOLVED") continue;

    // Check category match
    const categoryMatches = issue.category.toLowerCase() === newIssue.category.toLowerCase();

    // Check geographical distance using Haversine formula
    const distKm = getHaversineDistance(newIssue.lat, newIssue.lng, issue.lat, issue.lng);

    if (categoryMatches && distKm <= DUPLICATE_RADIUS_KM) {
      return {
        isDuplicate: true,
        matchingIssue: issue,
        distanceMeters: Math.round(distKm * 1000)
      };
    }
  }

  return { isDuplicate: false, matchingIssue: null, distanceMeters: null };
}

/**
 * Calculates geographical distance between two lat/lng pairs in KM
 */
export function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Performs simulated Computer Vision Before / After AI Repair Verification
 */
export function verifyRepairAI(beforeImg, afterImg) {
  // Simulate AI visual inspection comparison calculation
  const passProbability = 0.94; // High accuracy mock score
  const isVerified = passProbability > 0.8;

  return {
    isVerified,
    confidenceScore: 97.4,
    surfaceUniformityScore: 98.2,
    debrisClearanceScore: 99.1,
    statusText: isVerified ? "✓ AI VERIFICATION PASSED — Structural Repair Confirmed" : "⚠ AI VERIFICATION WARNING — Residual Fissure Detected",
    recommendation: isVerified ? "Issue marked RESOLVED. Digital Infrastructure Log updated." : "Requires manual inspector sign-off."
  };
}
