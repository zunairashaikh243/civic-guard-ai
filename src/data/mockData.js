export const INITIAL_ISSUES = [
  {
    id: "CG-2026-8801",
    title: "Severe Pothole & Sub-base Failure",
    category: "Pothole",
    categoryIcon: "AlertTriangle",
    description: "Deep asphalt pothole (approx 1.2m width, 18cm depth) near pedestrian crossing and school entrance. Exposed rebar causing tire blowouts.",
    location: "Grand Avenue & 14th St (Sector 4)",
    lat: 40.7128,
    lng: -74.0060,
    status: "REPORTED", // REPORTED, AI_VERIFIED, ASSIGNED, IN_PROGRESS, REPAIRED, RESOLVED
    severityScore: 92,
    severityLevel: "CRITICAL", // CRITICAL (85-100), HIGH (65-84), MEDIUM (40-64), LOW (0-39)
    confidence: 96,
    recommendedAction: "Dispatch emergency asphalt crew within 12-24 hours. Erect temporary hazard cone.",
    confirmations: 52,
    upvotes: 84,
    reportedBy: "Sarah Jenkins (Citizen)",
    reportedAt: "2026-10-05T14:30:00Z",
    assignedWorkerId: "W-101",
    assignedWorkerName: "Crew Alpha (Asphalt Unit)",
    department: "Department of Transportation & Roads",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    afterImageUrl: null,
    aiRepairStatus: null,
    predictiveRisk: {
      hasRisk: true,
      riskLevel: "CRITICAL",
      predictedOutcome: "Complete structural road collapse within 5 days if rainwater enters sub-base.",
      preventiveCost: "$350 (Cold patch)",
      failureCost: "$5,200 (Full lane resurfacing)"
    },
    metrics: {
      size: "1.2m x 0.8m",
      depth: "18 cm",
      trafficDensity: "High (14,500 vehicles/day)",
      nearbySensitivity: "School zone (St. Jude Elementary - 50m)",
      weatherImpact: "High (Thunderstorm expected tomorrow)"
    },
    timeline: [
      { status: "REPORTED", time: "Oct 5, 14:30", note: "Reported by Sarah Jenkins via Mobile App" },
      { status: "AI_VERIFIED", time: "Oct 5, 14:31", note: "AI Computer Vision detected 96% Pothole severity. Severity score 92 computed." }
    ]
  },
  {
    id: "CG-2026-8802",
    title: "Widening Surface Road Crack",
    category: "Road crack",
    categoryIcon: "FileText",
    description: "Transverse thermal crack expanding along northbound lane. Early signs of alligator cracking pattern.",
    location: "Beacon Street & 8th Ave (Sector 2)",
    lat: 40.7200,
    lng: -74.0120,
    status: "AI_VERIFIED",
    severityScore: 58,
    severityLevel: "MEDIUM",
    confidence: 91,
    recommendedAction: "Schedule preventive rubberized crack sealant within 7 days to prevent water intrusion.",
    confirmations: 14,
    upvotes: 23,
    reportedBy: "David Chen (Citizen)",
    reportedAt: "2026-10-04T09:15:00Z",
    assignedWorkerId: null,
    assignedWorkerName: null,
    department: "Department of Transportation & Roads",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    afterImageUrl: null,
    aiRepairStatus: null,
    predictiveRisk: {
      hasRisk: true,
      riskLevel: "HIGH",
      predictedOutcome: "84% probability of evolving into major pothole after upcoming freeze-thaw cycle.",
      preventiveCost: "$120 (Sealing)",
      failureCost: "$2,400 (Pothole restoration)"
    },
    metrics: {
      size: "3.4m length",
      depth: "2 cm",
      trafficDensity: "Medium (8,200 vehicles/day)",
      nearbySensitivity: "Commercial district",
      weatherImpact: "Moderate"
    },
    timeline: [
      { status: "REPORTED", time: "Oct 4, 09:15", note: "Reported by David Chen" },
      { status: "AI_VERIFIED", time: "Oct 4, 09:16", note: "AI Risk Engine flagged for early preventive sealing." }
    ]
  },
  {
    id: "CG-2026-8803",
    title: "Broken LED Streetlight Fixture",
    category: "Broken streetlight",
    categoryIcon: "Zap",
    description: "Main overhead streetlight non-functional. Area experiencing pitch-black conditions at night near bus station.",
    location: "5th Avenue & Elm St (Sector 1)",
    lat: 40.7180,
    lng: -73.9980,
    status: "ASSIGNED",
    severityScore: 78,
    severityLevel: "HIGH",
    confidence: 98,
    recommendedAction: "Replace driver module and LED fixture within 24 hours.",
    confirmations: 31,
    upvotes: 45,
    reportedBy: "Elena Rostova (Citizen)",
    reportedAt: "2026-10-05T20:10:00Z",
    assignedWorkerId: "W-102",
    assignedWorkerName: "Crew Beta (Electrical Grid)",
    department: "Public Utilities & Lighting",
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    afterImageUrl: null,
    aiRepairStatus: null,
    predictiveRisk: {
      hasRisk: false,
      riskLevel: "LOW",
      predictedOutcome: "Nighttime safety hazard.",
      preventiveCost: "$85",
      failureCost: "$85"
    },
    metrics: {
      size: "1 Fixture",
      depth: "N/A",
      trafficDensity: "High Pedestrian zone",
      nearbySensitivity: "Metro Bus Hub",
      weatherImpact: "Low"
    },
    timeline: [
      { status: "REPORTED", time: "Oct 5, 20:10", note: "Reported by Elena Rostova" },
      { status: "AI_VERIFIED", time: "Oct 5, 20:11", note: "AI Verified light sensor anomaly" },
      { status: "ASSIGNED", time: "Oct 5, 21:00", note: "Assigned to Crew Beta by Admin" }
    ]
  },
  {
    id: "CG-2026-8804",
    title: "Overflowing Storm Drain & Debris Blockage",
    category: "Overflowing drain",
    categoryIcon: "Droplets",
    description: "Storm drain inlet completely clogged with silt and plastic debris. Water accumulation extending into active driving lane.",
    location: "Central Station Plaza & 3rd St (Sector 3)",
    lat: 40.7100,
    lng: -74.0080,
    status: "IN_PROGRESS",
    severityScore: 89,
    severityLevel: "CRITICAL",
    confidence: 95,
    recommendedAction: "Dispatch vacuum gully emptier to clear main line before heavy rain.",
    confirmations: 64,
    upvotes: 98,
    reportedBy: "Marcus Vance (Citizen)",
    reportedAt: "2026-10-05T11:00:00Z",
    assignedWorkerId: "W-103",
    assignedWorkerName: "Crew Gamma (Hydro & Drainage)",
    department: "Water Infrastructure & Sewerage",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
    afterImageUrl: null,
    aiRepairStatus: null,
    predictiveRisk: {
      hasRisk: true,
      riskLevel: "CRITICAL",
      predictedOutcome: "Localized flash flooding into subway concourse during next storm event.",
      preventiveCost: "$280 (Vacuum clear)",
      failureCost: "$45,000 (Subway water damage)"
    },
    metrics: {
      size: "100% Grate Clog",
      depth: "15 cm standing water",
      trafficDensity: "Extremely High (Transit Hub)",
      nearbySensitivity: "Subway Station Entrance (15m)",
      weatherImpact: "Severe"
    },
    timeline: [
      { status: "REPORTED", time: "Oct 5, 11:00", note: "Reported by Marcus Vance" },
      { status: "AI_VERIFIED", time: "Oct 5, 11:01", note: "AI Severity 89 calculated" },
      { status: "ASSIGNED", time: "Oct 5, 11:30", note: "Assigned to Crew Gamma" },
      { status: "IN_PROGRESS", time: "Oct 5, 13:00", note: "Crew Gamma arrived on site with vacuum truck" }
    ]
  },
  {
    id: "CG-2026-8805",
    title: "Illegal Garbage Accumulation",
    category: "Garbage accumulation",
    categoryIcon: "Trash2",
    description: "Large volume of dumped construction waste and household refuse blocking public sidewalk.",
    location: "Oak Street & 22nd Ave (Sector 5)",
    lat: 40.7250,
    lng: -73.9900,
    status: "RESOLVED",
    severityScore: 45,
    severityLevel: "MEDIUM",
    confidence: 93,
    recommendedAction: "Deploy heavy sanitation truck for removal.",
    confirmations: 18,
    upvotes: 29,
    reportedBy: "Anita Patel (Citizen)",
    reportedAt: "2026-10-03T16:20:00Z",
    assignedWorkerId: "W-104",
    assignedWorkerName: "Crew Delta (Sanitation)",
    department: "Department of Environmental Services",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
    aiRepairStatus: "AI VERIFIED - 100% Debris Cleared",
    predictiveRisk: {
      hasRisk: false,
      riskLevel: "LOW",
      predictedOutcome: "Sanitation hazard.",
      preventiveCost: "$150",
      failureCost: "$150"
    },
    metrics: {
      size: "4 cubic meters",
      depth: "N/A",
      trafficDensity: "Low",
      nearbySensitivity: "Residential Alley",
      weatherImpact: "Low"
    },
    timeline: [
      { status: "REPORTED", time: "Oct 3, 16:20", note: "Reported by Anita Patel" },
      { status: "AI_VERIFIED", time: "Oct 3, 16:21", note: "AI Verified refuse bulk" },
      { status: "ASSIGNED", time: "Oct 3, 17:00", note: "Assigned to Crew Delta" },
      { status: "IN_PROGRESS", time: "Oct 4, 08:30", note: "Crew Delta on site" },
      { status: "REPAIRED", time: "Oct 4, 09:45", note: "Worker uploaded after-repair photo" },
      { status: "RESOLVED", time: "Oct 4, 09:46", note: "AI Verified 100% clean site. Issue Closed." }
    ]
  },
  {
    id: "CG-2026-8806",
    title: "Damaged Stop Sign at Blind Intersection",
    category: "Damaged traffic sign",
    categoryIcon: "AlertOctagon",
    description: "Stop sign bent at 60 degree angle due to vehicle impact. Sign face obscured from approaching drivers.",
    location: "4th Street & Pine Ave (Sector 2)",
    lat: 40.7150,
    lng: -74.0150,
    status: "AI_VERIFIED",
    severityScore: 84,
    severityLevel: "HIGH",
    confidence: 97,
    recommendedAction: "Replace pole and install high-visibility reflectorized Stop Sign post.",
    confirmations: 42,
    upvotes: 60,
    reportedBy: "Robert Taylor (Citizen)",
    reportedAt: "2026-10-05T18:40:00Z",
    assignedWorkerId: null,
    assignedWorkerName: null,
    department: "Traffic Safety & Signals Department",
    imageUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
    afterImageUrl: null,
    aiRepairStatus: null,
    predictiveRisk: {
      hasRisk: true,
      riskLevel: "HIGH",
      predictedOutcome: "Imminent vehicle collision risk at uncontrolled blind intersection.",
      preventiveCost: "$180 (Sign replacement)",
      failureCost: "High Liability / Traffic Accident"
    },
    metrics: {
      size: "1 Pole & Sign",
      depth: "N/A",
      trafficDensity: "High Intersection Traffic",
      nearbySensitivity: "High Collision Hotspot",
      weatherImpact: "Moderate"
    },
    timeline: [
      { status: "REPORTED", time: "Oct 5, 18:40", note: "Reported by Robert Taylor" },
      { status: "AI_VERIFIED", time: "Oct 5, 18:41", note: "AI Severity score 84 flagged for high collision risk." }
    ]
  }
];

export const SAMPLE_DETECTION_PRESETS = [
  {
    label: "Pothole Hazard",
    category: "Pothole",
    confidence: 96,
    severityScore: 92,
    severityLevel: "CRITICAL",
    recommendedAction: "Dispatch emergency asphalt repair within 24 hours.",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    bbox: { top: 35, left: 25, width: 45, height: 35 }
  },
  {
    label: "Severe Road Crack",
    category: "Road crack",
    confidence: 91,
    severityScore: 68,
    severityLevel: "HIGH",
    recommendedAction: "Apply rubberized polymer crack sealant.",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    bbox: { top: 20, left: 15, width: 65, height: 50 }
  },
  {
    label: "Broken LED Streetlight",
    category: "Broken streetlight",
    confidence: 98,
    severityScore: 78,
    severityLevel: "HIGH",
    recommendedAction: "Replace driver module and LED fixture.",
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    bbox: { top: 10, left: 40, width: 25, height: 45 }
  },
  {
    label: "Blocked Storm Drain",
    category: "Overflowing drain",
    confidence: 94,
    severityScore: 89,
    severityLevel: "CRITICAL",
    recommendedAction: "Clear vacuum inlet before rainfall.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
    bbox: { top: 30, left: 20, width: 50, height: 40 }
  }
];

export const WORKERS = [
  { id: "W-101", name: "Crew Alpha (Asphalt Unit)", sector: "Sector 4", vehicle: "Truck #A-04", status: "AVAILABLE" },
  { id: "W-102", name: "Crew Beta (Electrical Grid)", sector: "Sector 1", vehicle: "Bucket Van #B-12", status: "ON_TASK" },
  { id: "W-103", name: "Crew Gamma (Hydro & Drainage)", sector: "Sector 3", vehicle: "Vac Truck #G-08", status: "ON_TASK" },
  { id: "W-104", name: "Crew Delta (Sanitation)", sector: "Sector 5", vehicle: "Flatbed #D-02", status: "AVAILABLE" }
];

export const LOCATION_DIGITAL_HISTORIES = [
  {
    location: "Grand Avenue (Sector 4)",
    isRecurring: true,
    recurrenceCount: 3,
    recommendation: "Flagged: Recurring Sub-base Infrastructure Defect. Recommend full depth asphalt reconstruction and foundation drainage overhaul.",
    history: [
      { date: "Jan 12, 2025", category: "Road crack", action: "Cold crack seal applied", status: "RESOLVED" },
      { date: "May 04, 2025", category: "Pothole", action: "Asphalt patch applied", status: "RESOLVED" },
      { date: "Nov 18, 2025", category: "Pothole", action: "Emergency cold patch", status: "RESOLVED" },
      { date: "Oct 05, 2026", category: "Pothole", action: "Deep rebar pothole detected (Score 92)", status: "OPEN" }
    ]
  },
  {
    location: "Central Station Plaza (Sector 3)",
    isRecurring: true,
    recurrenceCount: 2,
    recommendation: "Flagged: Sediment Accumulation Vulnerability. Recommend install of automated silt trap grates.",
    history: [
      { date: "Mar 15, 2025", category: "Overflowing drain", action: "Gully vacuumed", status: "RESOLVED" },
      { date: "Oct 05, 2026", category: "Overflowing drain", action: "100% Debris clog detected (Score 89)", status: "OPEN" }
    ]
  }
];

export const CIVIC_BADGES = [
  { id: "b1", title: "Civic Observer", desc: "Reported 1 verified issue", icon: "Eye", color: "from-blue-500 to-cyan-500", unlocked: true },
  { id: "b2", title: "Community Helper", desc: "Confirmed 5 existing problems", icon: "HeartHandshake", color: "from-emerald-500 to-teal-500", unlocked: true },
  { id: "b3", title: "City Guardian", desc: "Earned 250+ Civic Points", icon: "ShieldCheck", color: "from-purple-500 to-indigo-500", unlocked: true },
  { id: "b4", title: "Infrastructure Champion", desc: "Top 5% active citizen in Metro City", icon: "Award", color: "from-amber-500 to-orange-500", unlocked: false }
];
