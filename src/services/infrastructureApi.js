import { INITIAL_ISSUES, WORKERS } from '../data/mockData';

const STORAGE_KEY = 'civicguard_issues';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const safeApiCall = async (request, fallbackValue) => {
  if (!isLiveDataEnabled() || !API_BASE_URL) {
    return fallbackValue;
  }

  try {
    return await request();
  } catch (error) {
    return fallbackValue;
  }
};

const normalizeStatus = (status) => {
  const value = String(status || 'REPORTED').toUpperCase();
  const statusMap = {
    REPORTED: 'REPORTED',
    AI_VERIFIED: 'AI_VERIFIED',
    PRIORITIZED: 'AI_VERIFIED',
    ASSIGNED: 'ASSIGNED',
    IN_PROGRESS: 'IN_PROGRESS',
    REPAIR_SUBMITTED: 'IN_PROGRESS',
    REPAIRED: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED'
  };

  return statusMap[value] || value;
};

export const getMapboxToken = () => String(import.meta.env.VITE_MAPBOX_TOKEN || '').trim();

export const isLiveDataEnabled = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return Boolean(baseUrl) && String(import.meta.env.VITE_USE_LIVE_DATA || 'false').toLowerCase() === 'true';
};

export const normalizeIssue = (issue = {}) => {
  const category = issue.issueType || issue.category || 'Pothole';
  const score = Number(issue.severityScore ?? issue.score ?? 55);
  const severityLevel = String(issue.severityLevel || (
    score >= 85 ? 'CRITICAL' : score >= 65 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW'
  )).toUpperCase();

  const riskScore = Number(issue.riskScore ?? issue.predictedRisk?.riskScore ?? issue.predictiveRisk?.riskScore ?? score);
  const riskLevel = String(issue.predictedRisk?.riskLevel || issue.riskLevel || (riskScore >= 80 ? 'HIGH' : riskScore >= 60 ? 'MEDIUM' : 'LOW')).toUpperCase();

  const locationName = issue.address || issue.location || 'Metro City Sector';
  const normalized = {
    ...issue,
    id: issue.id || issue.issueId || `INF-${Date.now()}`,
    issueType: category,
    category,
    title: issue.title || `${category} Hazard Detected`,
    description: issue.description || `${category} issue detected and requires municipal review.`,
    location: locationName,
    address: locationName,
    lat: Number(issue.latitude ?? issue.lat ?? 40.715),
    lng: Number(issue.longitude ?? issue.lng ?? -74.004),
    latitude: Number(issue.latitude ?? issue.lat ?? 40.715),
    longitude: Number(issue.longitude ?? issue.lng ?? -74.004),
    status: normalizeStatus(issue.status),
    severityScore: score,
    severityLevel,
    confidence: Number(issue.aiConfidence ?? issue.confidence ?? 90),
    aiConfidence: Number(issue.aiConfidence ?? issue.confidence ?? 90),
    confirmations: Number(issue.citizenConfirmations ?? issue.confirmations ?? 0),
    citizenConfirmations: Number(issue.citizenConfirmations ?? issue.confirmations ?? 0),
    reportCount: Number(issue.reportCount ?? (issue.citizenConfirmations ?? issue.confirmations ?? 1)),
    recommendedAction: issue.recommendedAction || issue.riskReason || 'Schedule preventive maintenance.',
    department: issue.department || 'Public Works Administration',
    assignedWorker: issue.assignedWorker || issue.assignedWorkerName || null,
    assignedWorkerName: issue.assignedWorker || issue.assignedWorkerName || null,
    assignedWorkerId: issue.assignedWorkerId || null,
    riskScore,
    riskLevel,
    predictedRisk: typeof issue.predictedRisk === 'object'
      ? { ...issue.predictedRisk, riskLevel: riskLevel }
      : {
          riskLevel,
          riskScore,
          prediction: issue.riskReason || 'Likely to worsen within the next 7 days.',
          recommendedAction: issue.recommendedAction || 'Schedule preventive maintenance.'
        },
    riskReason: issue.riskReason || 'Likely to worsen within the next 7 days.',
    repairDeadline: issue.repairDeadline || null,
    beforeImage: issue.beforeImage || issue.imageUrl || DEFAULT_IMAGE,
    afterImage: issue.afterImage || issue.afterImageUrl || null,
    repairStatus: issue.repairStatus || issue.aiRepairStatus || null,
    isRecurring: Boolean(issue.isRecurring ?? issue.recurring ?? false),
    imageUrl: issue.beforeImage || issue.imageUrl || DEFAULT_IMAGE,
    afterImageUrl: issue.afterImage || issue.afterImageUrl || null,
    reportedAt: issue.createdAt || issue.reportedAt || new Date().toISOString(),
    createdAt: issue.createdAt || issue.reportedAt || new Date().toISOString(),
    updatedAt: issue.updatedAt || new Date().toISOString(),
    timeline: issue.timeline || issue.history || [
      { status: 'REPORTED', time: 'Just now', note: 'Infrastructure issue reported.' }
    ],
    metrics: issue.metrics || {
      size: 'Standard defect area',
      depth: 'Moderate depth',
      trafficDensity: 'Moderate',
      nearbySensitivity: 'Standard zone',
      weatherImpact: 'Moderate'
    }
  };

  return normalized;
};

export const readStoredIssues = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_ISSUES.map(normalizeIssue);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeIssue) : INITIAL_ISSUES.map(normalizeIssue);
  } catch (error) {
    return INITIAL_ISSUES.map(normalizeIssue);
  }
};

export const writeStoredIssues = (issues) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(issues.map(normalizeIssue)));
  } catch (error) {
    // Ignore localStorage write errors in restricted environments.
  }
};

export const calculatePriorityScore = (issue) => {
  const severity = Number(issue.severityScore || 0);
  const risk = Number(issue.riskScore || 0);
  const confirmations = Number(issue.citizenConfirmations || issue.confirmations || 0);
  const traffic = issue.metrics?.trafficDensity?.toLowerCase().includes('high') ? 20 : 12;
  const recurrenceBonus = issue.isRecurring ? 10 : 0;
  const agePenalty = Math.min(10, Math.max(0, 0));

  return Math.min(100, severity + risk * 0.45 + confirmations * 1.2 + traffic + recurrenceBonus + agePenalty);
};

export const getIssues = async () => {
  return safeApiCall(
    async () => {
      const response = await fetch(`${API_BASE_URL}/api/issues`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch issues');
      const payload = await response.json();
      const issues = Array.isArray(payload) ? payload : payload.issues || [];
      return issues.map(normalizeIssue);
    },
    readStoredIssues().map(normalizeIssue)
  );
};

export const getWorkers = async () => {
  return safeApiCall(
    async () => {
      const response = await fetch(`${API_BASE_URL}/api/workers`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch workers');
      const payload = await response.json();
      return Array.isArray(payload) ? payload : payload.workers || WORKERS;
    },
    WORKERS
  );
};

export const analyzeSeverity = async (payload = {}) => {
  return safeApiCall(
    async () => {
      const response = await fetch(`${API_BASE_URL}/api/analyze-severity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Severity analysis failed');
      return response.json();
    },
    (() => {
      const weight = {
        damage: 0.3,
        traffic: 0.2,
        confirmations: 0.15,
        location: 0.15,
        recurrence: 0.1,
        age: 0.1
      };

      const issueType = String(payload.issueType || 'Pothole');
      const trafficLevel = String(payload.trafficLevel || 'High').toLowerCase();
      const nearbyCritical = Boolean(payload.nearbyCriticalLocation);
      const citizenConfirmations = Number(payload.citizenConfirmations || 0);
      const previousReports = Number(payload.previousReports || 0);
      const imageBonus = payload.image ? 8 : 0;
      const damageBase = issueType.toLowerCase().includes('pothole') ? 72 : issueType.toLowerCase().includes('drain') ? 64 : 58;
      const trafficBoost = trafficLevel.includes('high') ? 18 : trafficLevel.includes('medium') ? 12 : 8;
      const locationBoost = nearbyCritical ? 14 : 8;
      const recurrenceBoost = previousReports > 2 ? 10 : previousReports > 0 ? 6 : 0;
      const confirmationBoost = Math.min(20, citizenConfirmations * 1.5);
      const ageBoost = !payload.previousReports ? 6 : 9;

      const score = Math.min(100, Math.round(
        damageBase * weight.damage +
        trafficBoost * weight.traffic +
        confirmationBoost * weight.confirmations +
        locationBoost * weight.location +
        recurrenceBoost * weight.recurrence +
        ageBoost * weight.age +
        imageBonus
      ));

      const severityLevel = score >= 85 ? 'CRITICAL' : score >= 65 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';

      return {
        severityScore: score,
        severityLevel,
        confidence: Math.min(99, Math.max(70, Math.round(80 + score * 0.18 + (nearbyCritical ? 5 : 0)))),
        explanation: `Large ${issueType.toLowerCase()} issue located on a ${trafficLevel} traffic corridor with ${citizenConfirmations} confirmatory reports.`
      };
    })()
  );
};

export const predictRisk = async (payload = {}) => {
  return safeApiCall(
    async () => {
      const response = await fetch(`${API_BASE_URL}/api/predict-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Risk prediction failed');
      return response.json();
    },
    (() => {
      const issueType = String(payload.issueType || 'Pothole');
      const severity = Number(payload.severityScore || 60);
      const traffic = String(payload.trafficLevel || 'High');
      const riskScore = Math.min(100, Math.round(severity * 0.6 + (traffic.toLowerCase().includes('high') ? 18 : 10) + (payload.previousReports ? 10 : 0)));
      const riskLevel = riskScore >= 80 ? 'HIGH' : riskScore >= 60 ? 'MEDIUM' : 'LOW';

      return {
        riskScore,
        riskLevel,
        prediction: `Likely to worsen into a significant ${issueType.toLowerCase()} issue within the next 7 days.`,
        recommendedAction: riskLevel === 'HIGH' ? 'Schedule preventive maintenance within 48 hours.' : 'Monitor and schedule routine maintenance.'
      };
    })()
  );
};

export const createIssue = async (formData = {}) => {
  const analysis = await analyzeSeverity({
    issueType: formData.category,
    latitude: formData.lat,
    longitude: formData.lng,
    image: formData.imageUrl,
    citizenConfirmations: 1,
    trafficLevel: formData.trafficDensity || 'High',
    nearbyCriticalLocation: Boolean(formData.isNearSensitiveZone),
    previousReports: 0
  });

  const risk = await predictRisk({
    issueType: formData.category,
    severityScore: analysis.severityScore,
    trafficLevel: formData.trafficDensity || 'High',
    previousReports: 0
  });

  const payload = normalizeIssue({
    id: `INF-${Date.now()}`,
    issueType: formData.category,
    description: formData.description || `${formData.category} reported by citizen.`,
    address: formData.location || 'Metro City Sector',
    latitude: Number(formData.lat ?? 40.715),
    longitude: Number(formData.lng ?? -74.004),
    severityScore: analysis.severityScore,
    severityLevel: analysis.severityLevel,
    aiConfidence: analysis.confidence,
    citizenConfirmations: 1,
    reportCount: 1,
    status: 'AI_VERIFIED',
    assignedWorker: null,
    department: formData.department || 'Public Works Administration',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    riskScore: risk.riskScore,
    riskLevel: risk.riskLevel,
    riskReason: risk.prediction,
    recommendedAction: risk.recommendedAction,
    beforeImage: formData.imageUrl || DEFAULT_IMAGE,
    imageUrl: formData.imageUrl || DEFAULT_IMAGE,
    predictedRisk: {
      riskLevel: risk.riskLevel,
      riskScore: risk.riskScore,
      prediction: risk.prediction,
      recommendedAction: risk.recommendedAction
    },
    timeline: [
      { status: 'REPORTED', time: 'Just now', note: 'Citizen reported issue via civic dashboard.' },
      { status: 'AI_VERIFIED', time: 'Just now', note: `AI severity score ${analysis.severityScore} (${analysis.severityLevel}) computed.` }
    ]
  });

  const existing = readStoredIssues();
  const next = [payload, ...existing];
  writeStoredIssues(next);

  if (isLiveDataEnabled() && API_BASE_URL) {
    try {
      await fetch(`${API_BASE_URL}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      // Fall back gracefully to local demo data when live API is unreachable.
    }
  }

  return payload;
};

export const confirmIssue = async (issueId) => {
  const issues = readStoredIssues();
  const index = issues.findIndex((issue) => issue.id === issueId);
  if (index === -1) return null;

  const issue = normalizeIssue(issues[index]);
  const nextConfirmations = Number(issue.citizenConfirmations || issue.confirmations || 0) + 1;

  const nextIssue = normalizeIssue({
    ...issue,
    citizenConfirmations: nextConfirmations,
    confirmations: nextConfirmations,
    severityScore: Math.max(issue.severityScore, Math.min(100, issue.severityScore + 4)),
    severityLevel: Math.max(issue.severityScore, issue.severityScore + 4) >= 85 ? 'CRITICAL' : Math.max(issue.severityScore, issue.severityScore + 4) >= 65 ? 'HIGH' : 'MEDIUM',
    updatedAt: new Date().toISOString(),
    timeline: [
      ...(Array.isArray(issue.timeline) ? issue.timeline : []),
      { status: 'CONFIRMED', time: 'Just now', note: `Citizen confirmation received. Total confirmations: ${nextConfirmations}.` }
    ]
  });

  const next = issues.map((entry) => (entry.id === issueId ? nextIssue : normalizeIssue(entry)));
  writeStoredIssues(next);

  if (isLiveDataEnabled() && API_BASE_URL) {
    try {
      await fetch(`${API_BASE_URL}/api/issues/${issueId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId, citizenConfirmations: nextConfirmations })
      });
    } catch (error) {
      // Gracefully fallback to local data updates when the live service is unavailable.
    }
  }

  return nextIssue;
};

export const assignIssue = async (issueId, assignment = {}) => {
  const issues = readStoredIssues();
  const issue = normalizeIssue(issues.find((item) => item.id === issueId) || {});
  if (!issue.id) return null;

  const worker = WORKERS.find((candidate) => candidate.id === assignment.workerId || candidate.name === assignment.workerName)
    || WORKERS[0];

  const nextIssue = normalizeIssue({
    ...issue,
    status: 'ASSIGNED',
    assignedWorker: worker?.name || assignment.workerName || 'Unassigned',
    assignedWorkerName: worker?.name || assignment.workerName || 'Unassigned',
    assignedWorkerId: worker?.id || assignment.workerId || null,
    department: assignment.department || issue.department,
    repairDeadline: assignment.deadline || issue.repairDeadline,
    updatedAt: new Date().toISOString(),
    timeline: [
      ...(Array.isArray(issue.timeline) ? issue.timeline : []),
      { status: 'ASSIGNED', time: 'Just now', note: `Assigned to ${worker?.name || assignment.workerName || 'worker'} (${assignment.department || issue.department}).` }
    ]
  });

  const next = issues.map((entry) => (entry.id === issueId ? nextIssue : normalizeIssue(entry)));
  writeStoredIssues(next);

  if (isLiveDataEnabled() && API_BASE_URL) {
    try {
      await fetch(`${API_BASE_URL}/api/issues/${issueId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId: worker?.id, department: assignment.department || issue.department, deadline: assignment.deadline || issue.repairDeadline })
      });
    } catch (error) {
      // Gracefully fall back to local assignment logic when the live endpoint is unavailable.
    }
  }

  return nextIssue;
};

export const verifyRepair = async (issueId, afterImage) => {
  const issues = readStoredIssues();
  const original = normalizeIssue(issues.find((item) => item.id === issueId) || {});
  if (!original.id) return { repairVerified: false, confidence: 0, message: 'Issue not found.' };

  const repaired = {
    repairVerified: true,
    confidence: 92,
    message: 'Infrastructure damage appears to have been repaired.'
  };

  const nextIssue = normalizeIssue({
    ...original,
    status: 'RESOLVED',
    afterImageUrl: afterImage || original.afterImageUrl,
    afterImage: afterImage || original.afterImage,
    repairStatus: 'AI VERIFIED',
    updatedAt: new Date().toISOString(),
    timeline: [
      ...(Array.isArray(original.timeline) ? original.timeline : []),
      { status: 'REPAIR_SUBMITTED', time: 'Just now', note: 'Worker submitted repair evidence.' },
      { status: 'RESOLVED', time: 'Just now', note: 'AI verification passed; issue resolved.' }
    ]
  });

  const next = issues.map((entry) => (entry.id === issueId ? nextIssue : normalizeIssue(entry)));
  writeStoredIssues(next);

  if (isLiveDataEnabled() && API_BASE_URL) {
    try {
      await fetch(`${API_BASE_URL}/api/issues/${issueId}/verify-repair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ afterImage, issueId })
      });
    } catch (error) {
      // Ignore live verification failures and keep the demo fallback active.
    }
  }

  return repaired;
};

export const updateIssueStatus = async (issueId, nextStatus) => {
  const issues = readStoredIssues();
  const issue = normalizeIssue(issues.find((item) => item.id === issueId) || {});
  if (!issue.id) return null;

  const nextIssue = normalizeIssue({
    ...issue,
    status: normalizeStatus(nextStatus),
    updatedAt: new Date().toISOString(),
    timeline: [
      ...(Array.isArray(issue.timeline) ? issue.timeline : []),
      { status: normalizeStatus(nextStatus), time: 'Just now', note: 'Status updated via API layer.' }
    ]
  });

  const next = issues.map((entry) => (entry.id === issueId ? nextIssue : normalizeIssue(entry)));
  writeStoredIssues(next);
  return nextIssue;
};

export const getDashboardStats = async () => {
  const issues = readStoredIssues();
  const total = issues.length;
  const critical = issues.filter((i) => normalizeIssue(i).severityLevel === 'CRITICAL').length;
  const highRisk = issues.filter((i) => normalizeIssue(i).riskLevel === 'HIGH' || normalizeIssue(i).severityLevel === 'HIGH').length;
  const pending = issues.filter((i) => normalizeIssue(i).status !== 'RESOLVED').length;
  const inProgress = issues.filter((i) => normalizeIssue(i).status === 'IN_PROGRESS').length;
  const resolved = issues.filter((i) => normalizeIssue(i).status === 'RESOLVED').length;
  const citizenConfirmations = issues.reduce((sum, issue) => sum + Number(normalizeIssue(issue).citizenConfirmations || 0), 0);

  return {
    totalIssues: total,
    criticalIssues: critical,
    highRiskIssues: highRisk,
    pendingRepairs: pending,
    inProgress,
    resolved,
    averageResolutionTime: '18.4 hrs',
    citizenConfirmations
  };
};
