import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ISSUES, WORKERS, CIVIC_BADGES, LOCATION_DIGITAL_HISTORIES } from '../data/mockData';
import { calculateAISeverityScore, generatePredictiveRiskAnalysis, checkForDuplicateReport, verifyRepairAI } from '../utils/aiEngine';
import confetti from 'canvas-confetti';
import {
  readStoredIssues,
  writeStoredIssues,
  normalizeIssue,
  analyzeSeverity,
  predictRisk,
  createIssue,
  confirmIssue as confirmIssueApi,
  assignIssue as assignIssueApi,
  verifyRepair as verifyRepairApi,
  getMapboxToken,
  isLiveDataEnabled
} from '../services/infrastructureApi';

const InfrastructureContext = createContext();

export const InfrastructureProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('citizen');
  const [activeView, setActiveView] = useState('landing');
  const [issues, setIssues] = useState(() => readStoredIssues());
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [civicPoints, setCivicPoints] = useState(380);
  const [badges, setBadges] = useState(CIVIC_BADGES);
  const [digitalHistories, setDigitalHistories] = useState(LOCATION_DIGITAL_HISTORIES);
  const [demoStep, setDemoStep] = useState(0);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [dataMode, setDataMode] = useState(isLiveDataEnabled() ? 'LIVE DATA' : 'DEMO MODE');
  const [mapboxToken, setMapboxToken] = useState(getMapboxToken());

  const [emergencyAlert, setEmergencyAlert] = useState({
    active: true,
    title: '🚨 EMERGENCY INFRASTRUCTURE ALERT',
    message: 'Severe Pothole & Rebar Exposure on Grand Avenue near St. Jude Elementary (Score 92). High hazard score.',
    issueId: 'CG-2026-8801'
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'CRITICAL', text: '🚨 Emergency Alert: Deep Pothole detected near St. Jude Elementary School.', time: '10 mins ago', read: false },
    { id: 2, type: 'AI', text: '🤖 AI Verification complete: 96% confidence Pothole classification.', time: '15 mins ago', read: false },
    { id: 3, type: 'WORKER', text: '👷 Crew Gamma dispatched to Storm Drain blockage at Central Station.', time: '45 mins ago', read: true }
  ]);

  useEffect(() => {
    setDataMode(isLiveDataEnabled() ? 'LIVE DATA' : 'DEMO MODE');
    setMapboxToken(getMapboxToken());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      writeStoredIssues(issues);
    }
  }, [issues]);

  useEffect(() => {
    if (!isDemoRunning) return;

    const timer = setInterval(() => {
      setIssues((prev) => {
        if (!prev.length) return prev;
        const index = Math.floor(Math.random() * prev.length);
        const current = normalizeIssue(prev[index]);
        const boostedSeverity = Math.min(100, current.severityScore + 2);
        const updated = normalizeIssue({
          ...current,
          severityScore: boostedSeverity,
          severityLevel: boostedSeverity >= 85 ? 'CRITICAL' : boostedSeverity >= 65 ? 'HIGH' : boostedSeverity >= 40 ? 'MEDIUM' : 'LOW',
          citizenConfirmations: Number(current.citizenConfirmations || current.confirmations || 0) + 1,
          confirmations: Number(current.citizenConfirmations || current.confirmations || 0) + 1,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...(Array.isArray(current.timeline) ? current.timeline : []),
            { status: 'CONFIRMED', time: 'Just now', note: 'Live demo: citizen confirmation came in and priority was recalculated.' }
          ]
        });

        return prev.map((issue, itemIndex) => itemIndex === index ? updated : normalizeIssue(issue));
      });
    }, 22000);

    return () => clearInterval(timer);
  }, [isDemoRunning]);

  const addNotification = (type, text) => {
    const newNotif = { id: Date.now(), type, text, time: 'Just now', read: false };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addCivicPoints = (points, reason) => {
    setCivicPoints((prev) => {
      const next = prev + points;
      if (Math.floor(next / 100) > Math.floor(prev / 100)) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
      return next;
    });

    addNotification('CIVIC', `🎉 +${points} Civic Points earned: ${reason}`);
  };

  const getDepartmentForCategory = (cat) => {
    switch (cat) {
      case 'Pothole':
      case 'Road crack':
      case 'Damaged road':
        return 'Department of Transportation & Roads';
      case 'Broken streetlight':
        return 'Public Utilities & Lighting';
      case 'Overflowing drain':
      case 'Blocked drain':
        return 'Water Infrastructure & Sewerage';
      case 'Garbage accumulation':
        return 'Department of Environmental Services';
      case 'Damaged traffic sign':
      case 'Fallen tree/road obstruction':
        return 'Traffic Safety & Emergency Management';
      default:
        return 'Public Works Administration';
    }
  };

  const submitComplaint = async (formData) => {
    const duplicateCheck = checkForDuplicateReport(formData, issues);

    if (duplicateCheck.isDuplicate) {
      const match = duplicateCheck.matchingIssue;
      await confirmExistingIssue(match.id);
      return {
        isDuplicate: true,
        matchingIssue: match,
        message: `Existing infrastructure issue detected within ${duplicateCheck.distanceMeters}m! Your report has been merged and confirmation added (+15 Civic Points).`
      };
    }

    const severityData = await analyzeSeverity({
      issueType: formData.category,
      latitude: formData.lat,
      longitude: formData.lng,
      image: formData.imageUrl,
      citizenConfirmations: 1,
      trafficLevel: formData.trafficDensity || 'High',
      nearbyCriticalLocation: Boolean(formData.isNearSensitiveZone),
      previousReports: 0
    });

    const predictiveRisk = await predictRisk({
      issueType: formData.category,
      severityScore: severityData.severityScore,
      trafficLevel: formData.trafficDensity || 'High',
      previousReports: 0
    });

    const created = await createIssue({
      ...formData,
      category: formData.category,
      department: getDepartmentForCategory(formData.category),
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      isNearSensitiveZone: formData.isNearSensitiveZone || false
    });

    const normalized = normalizeIssue(created);
    setIssues((prev) => [normalized, ...prev.map((issue) => normalizeIssue(issue))]);
    setSelectedIssue(normalized);
    addCivicPoints(50, `Reported genuine ${formData.category}`);
    addNotification('AI', `🤖 AI Verified new complaint: ${normalized.title} (Severity ${severityData.severityScore})`);

    return { isDuplicate: false, issue: normalized, severityData, predictiveRisk };
  };

  const confirmExistingIssue = async (issueId) => {
    const updated = await confirmIssueApi(issueId);
    if (!updated) return null;

    setIssues((prev) => prev.map((issue) => {
      const normalizedIssue = normalizeIssue(issue);
      return normalizedIssue.id === issueId ? normalizeIssue(updated) : normalizedIssue;
    }));

    addCivicPoints(15, 'Confirmed existing public infrastructure issue');
    addNotification('LIVE', '+1 Citizen Confirmation');
    return updated;
  };

  const assignWorker = async (issueId, workerId) => {
    const worker = WORKERS.find((item) => item.id === workerId) || WORKERS[0];
    if (!worker) return;

    const updated = await assignIssueApi(issueId, {
      workerId: worker.id,
      workerName: worker.name,
      department: 'Road Maintenance',
      deadline: '48 hours'
    });

    if (!updated) return;

    setIssues((prev) => prev.map((issue) => {
      const normalizedIssue = normalizeIssue(issue);
      return normalizedIssue.id === issueId ? normalizeIssue(updated) : normalizedIssue;
    }));

    addNotification('ASSIGN', `👷 Assigned ${worker.name} to Issue #${issueId}`);
    return updated;
  };

  const completeRepairWithAI = async (issueId, afterImageUrl) => {
    const targetIssue = issues.find((item) => item.id === issueId);
    if (!targetIssue) return null;

    const aiResult = await verifyRepairApi(issueId, afterImageUrl);
    const refreshed = readStoredIssues().find((issue) => issue.id === issueId);
    if (refreshed) {
      setIssues((prev) => prev.map((issue) => {
        const normalizedIssue = normalizeIssue(issue);
        return normalizedIssue.id === issueId ? normalizeIssue(refreshed) : normalizedIssue;
      }));
    }

    if (aiResult?.repairVerified) {
      setDigitalHistories((prev) => {
        const existing = prev.find((history) => history.location.toLowerCase().includes(targetIssue.location?.split('&')[0].trim().toLowerCase() || ''));
        if (existing) {
          return prev.map((history) => {
            if (history === existing) {
              return {
                ...history,
                history: [
                  { date: 'Oct 2026', category: targetIssue.category, action: 'AI Verified Repair Completed', status: 'RESOLVED' },
                  ...history.history
                ]
              };
            }
            return history;
          });
        }
        return prev;
      });
    }

    addNotification('RESOLVE', `✅ Issue #${issueId} Repaired & AI Verified! Marked as RESOLVED.`);
    return aiResult;
  };

  const resetData = () => {
    setIssues(INITIAL_ISSUES.map((issue) => normalizeIssue(issue)));
    setSelectedIssue(null);
    setCivicPoints(380);
    setDemoStep(0);
    setIsDemoRunning(false);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('civicguard_issues');
    }
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
      workers: WORKERS,
      dataMode,
      mapboxToken
    }}>
      {children}
    </InfrastructureContext.Provider>
  );
};

export const useInfrastructure = () => useContext(InfrastructureContext);
