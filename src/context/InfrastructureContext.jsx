import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ISSUES, WORKERS, CIVIC_BADGES, LOCATION_DIGITAL_HISTORIES } from '../data/mockData';
import { calculateAISeverityScore, generatePredictiveRiskAnalysis, checkForDuplicateReport, verifyRepairAI } from '../utils/aiEngine';
import confetti from 'canvas-confetti';

const InfrastructureContext = createContext();

export const InfrastructureProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('citizen'); // 'citizen', 'worker', 'admin'
  const [activeView, setActiveView] = useState('landing'); // 'landing', 'citizen', 'worker', 'admin'
  
  // Issues state
  const [issues, setIssues] = useState(() => {
    const saved = localStorage.getItem('civicguard_issues');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [civicPoints, setCivicPoints] = useState(380);
  const [badges, setBadges] = useState(CIVIC_BADGES);
  const [digitalHistories, setDigitalHistories] = useState(LOCATION_DIGITAL_HISTORIES);
  
  // Hackathon Automated Demo Step Controller
  const [demoStep, setDemoStep] = useState(0); // 0 = off, 1-12 active demo steps
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Live Emergency Alert Banner
  const [emergencyAlert, setEmergencyAlert] = useState({
    active: true,
    title: "🚨 EMERGENCY INFRASTRUCTURE ALERT",
    message: "Severe Pothole & Rebar Exposure on Grand Avenue near St. Jude Elementary (Score 92). High hazard score.",
    issueId: "CG-2026-8801"
  });

  // Notifications drawer state
  const [notifications, setNotifications] = useState([
    { id: 1, type: "CRITICAL", text: "🚨 Emergency Alert: Deep Pothole detected near St. Jude Elementary School.", time: "10 mins ago", read: false },
    { id: 2, type: "AI", text: "🤖 AI Verification complete: 96% confidence Pothole classification.", time: "15 mins ago", read: false },
    { id: 3, type: "WORKER", text: "👷 Crew Gamma dispatched to Storm Drain blockage at Central Station.", time: "45 mins ago", read: true }
  ]);

  // Sync issues with localStorage
  useEffect(() => {
    localStorage.setItem('civicguard_issues', JSON.stringify(issues));
  }, [issues]);

  // Add Civic Points with celebration sound / confetti
  const addCivicPoints = (points, reason) => {
    setCivicPoints(prev => {
      const next = prev + points;
      // Trigger confetti if threshold crossed
      if (Math.floor(next / 100) > Math.floor(prev / 100)) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
      return next;
    });

    addNotification("CIVIC", `🎉 +${points} Civic Points earned: ${reason}`);
  };

  // Helper to add notification
  const addNotification = (type, text) => {
    const newNotif = {
      id: Date.now(),
      type,
      text,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Submit new complaint from Citizen
  const submitComplaint = (formData) => {
    // 1. Check for Duplicate Report
    const duplicateCheck = checkForDuplicateReport(formData, issues);

    if (duplicateCheck.isDuplicate) {
      const match = duplicateCheck.matchingIssue;
      // Confirm existing issue instead of creating duplicate
      confirmExistingIssue(match.id);
      return {
        isDuplicate: true,
        matchingIssue: match,
        message: `Existing infrastructure issue detected within ${duplicateCheck.distanceMeters}m! Your report has been merged and confirmation added (+15 Civic Points).`
      };
    }

    // 2. Compute AI Severity Score
    const severityData = calculateAISeverityScore({
      category: formData.category,
      confirmations: 1,
      trafficDensity: formData.trafficDensity || "High",
      isNearSensitiveZone: formData.isNearSensitiveZone || false,
      weatherImpact: "Moderate"
    });

    // 3. Generate Early Warning Predictive Risk
    const predictiveRisk = generatePredictiveRiskAnalysis(formData.category, severityData.score);

    const newIssue = {
      id: `CG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title || `${formData.category} Hazard Detected`,
      category: formData.category,
      description: formData.description,
      location: formData.location || "Metro City Sector",
      lat: formData.lat || 40.7145,
      lng: formData.lng || -74.0040,
      status: "AI_VERIFIED",
      severityScore: severityData.score,
      severityLevel: severityData.severityLevel,
      confidence: formData.confidence || 95,
      recommendedAction: severityData.severityLevel === "CRITICAL" 
        ? "Emergency dispatch within 12-24 hours."
        : "Schedule repair within 3-5 days.",
      confirmations: 1,
      upvotes: 1,
      reportedBy: "You (Citizen)",
      reportedAt: new Date().toISOString(),
      assignedWorkerId: null,
      assignedWorkerName: null,
      department: getDepartmentForCategory(formData.category),
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      afterImageUrl: null,
      aiRepairStatus: null,
      predictiveRisk,
      metrics: {
        size: formData.size || "Standard defect area",
        depth: formData.depth || "Moderate depth",
        trafficDensity: formData.trafficDensity || "High",
        nearbySensitivity: formData.isNearSensitiveZone ? "Near School/Hospital" : "Standard Zone",
        weatherImpact: "Forecasted Rain"
      },
      timeline: [
        { status: "REPORTED", time: "Just now", note: "Reported by citizen via CivicGuard App" },
        { status: "AI_VERIFIED", time: "Just now", note: `AI Verified ${formData.category} (Confidence ${formData.confidence || 95}%). Severity Score: ${severityData.score} (${severityData.severityLevel})` }
      ]
    };

    setIssues(prev => [newIssue, ...prev]);
    setSelectedIssue(newIssue);
    addCivicPoints(50, `Reported genuine ${formData.category}`);
    addNotification("AI", `🤖 AI Verified new complaint: ${newIssue.title} (Severity ${severityData.score})`);

    return { isDuplicate: false, issue: newIssue };
  };

  // Upvote / Confirm existing issue
  const confirmExistingIssue = (issueId) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const nextConfirmations = issue.confirmations + 1;
        // Re-evaluate severity score with extra confirmations!
        const reevaluated = calculateAISeverityScore({
          category: issue.category,
          confirmations: nextConfirmations,
          trafficDensity: issue.metrics?.trafficDensity || "High",
          isNearSensitiveZone: issue.metrics?.nearbySensitivity?.includes("School") || false
        });

        return {
          ...issue,
          confirmations: nextConfirmations,
          upvotes: issue.upvotes + 1,
          severityScore: Math.max(issue.severityScore, reevaluated.score),
          severityLevel: reevaluated.severityLevel,
          timeline: [
            ...issue.timeline,
            { status: issue.status, time: "Just now", note: `Citizen confirmed issue. Total confirmations: ${nextConfirmations}. Priority re-evaluated to ${reevaluated.score}.` }
          ]
        };
      }
      return issue;
    }));

    addCivicPoints(15, "Confirmed existing public infrastructure issue");
  };

  // Assign worker from Admin
  const assignWorker = (issueId, workerId) => {
    const worker = WORKERS.find(w => w.id === workerId);
    if (!worker) return;

    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: "ASSIGNED",
          assignedWorkerId: worker.id,
          assignedWorkerName: worker.name,
          timeline: [
            ...issue.timeline,
            { status: "ASSIGNED", time: "Just now", note: `Assigned to ${worker.name} (${worker.vehicle}) by Municipal Admin.` }
          ]
        };
      }
      return issue;
    }));

    addNotification("ASSIGN", `👷 Assigned ${worker.name} to Issue #${issueId}`);
  };

  // Worker uploads repair image & closes ticket with Before/After AI Verification
  const completeRepairWithAI = (issueId, afterImageUrl) => {
    const targetIssue = issues.find(i => i.id === issueId);
    if (!targetIssue) return;

    // Run AI Verification comparing before & after
    const aiResult = verifyRepairAI(targetIssue.imageUrl, afterImageUrl);

    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const newStatus = aiResult.isVerified ? "RESOLVED" : "REPAIRED";
        return {
          ...issue,
          status: newStatus,
          afterImageUrl,
          aiRepairStatus: aiResult.statusText,
          timeline: [
            ...issue.timeline,
            { status: "REPAIRED", time: "Just now", note: "Municipal worker completed repair and uploaded evidence photo." },
            { status: newStatus, time: "Just now", note: `AI Computer Vision Scan: ${aiResult.statusText}. Uniformity: ${aiResult.surfaceUniformityScore}%` }
          ]
        };
      }
      return issue;
    }));

    // Update Digital History if resolved
    if (aiResult.isVerified) {
      updateDigitalHistoryLog(targetIssue);
    }

    addNotification("RESOLVE", `✅ Issue #${issueId} Repaired & AI Verified! Marked as RESOLVED.`);
    return aiResult;
  };

  // Helper to log resolved issue into digital location history
  const updateDigitalHistoryLog = (issue) => {
    setDigitalHistories(prev => {
      const existing = prev.find(h => h.location.toLowerCase().includes(issue.location.split('&')[0].trim().toLowerCase()));
      if (existing) {
        return prev.map(h => {
          if (h === existing) {
            return {
              ...h,
              history: [
                { date: "Oct 2026", category: issue.category, action: "AI Verified Repair Completed", status: "RESOLVED" },
                ...h.history
              ]
            };
          }
          return h;
        });
      }
      return prev;
    });
  };

  // Department helper
  const getDepartmentForCategory = (cat) => {
    switch (cat) {
      case "Pothole":
      case "Road crack":
      case "Damaged road":
        return "Department of Transportation & Roads";
      case "Broken streetlight":
        return "Public Utilities & Lighting";
      case "Overflowing drain":
      case "Blocked drain":
        return "Water Infrastructure & Sewerage";
      case "Garbage accumulation":
        return "Department of Environmental Services";
      case "Damaged traffic sign":
      case "Fallen tree/road obstruction":
        return "Traffic Safety & Emergency Management";
      default:
        return "Public Works Administration";
    }
  };

  // Reset data to default
  const resetData = () => {
    setIssues(INITIAL_ISSUES);
    localStorage.removeItem('civicguard_issues');
    setCivicPoints(380);
    setDemoStep(0);
    setIsDemoRunning(false);
  };

  return (
    <InfrastructureContext.Provider value={{
      userRole,
      setUserRole,
      activeView,
      setActiveView,
      issues,
      setIssues,
      selectedIssue,
      setSelectedIssue,
      civicPoints,
      badges,
      digitalHistories,
      emergencyAlert,
      setEmergencyAlert,
      notifications,
      submitComplaint,
      confirmExistingIssue,
      assignWorker,
      completeRepairWithAI,
      addCivicPoints,
      demoStep,
      setDemoStep,
      isDemoRunning,
      setIsDemoRunning,
      resetData,
      workers: WORKERS
    }}>
      {children}
    </InfrastructureContext.Provider>
  );
};

export const useInfrastructure = () => useContext(InfrastructureContext);
