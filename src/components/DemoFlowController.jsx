import React from 'react';
import { useInfrastructure } from '../context/InfrastructureContext';
import { PlayCircle, SkipForward, CheckCircle2, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';

export default function DemoFlowController() {
  const { 
    demoStep, 
    setDemoStep, 
    isDemoRunning, 
    setIsDemoRunning, 
    setActiveView,
    setUserRole,
    submitComplaint,
    assignWorker,
    completeRepairWithAI,
    issues
  } = useInfrastructure();

  if (!isDemoRunning) return null;

  const DEMO_STEPS = [
    { step: 1, title: "1. Citizen Uploads Image", desc: "Citizen captures severe pothole photo on Grand Avenue.", role: "citizen", view: "citizen" },
    { step: 2, title: "2. AI Computer Vision Scan", desc: "AI detects 96% Pothole hazard with bounding box overlay.", role: "citizen", view: "citizen" },
    { step: 3, title: "3. AI Severity Calculation", desc: "Multi-factor algorithm computes Priority Score: 92 (CRITICAL).", role: "citizen", view: "citizen" },
    { step: 4, title: "4. Duplicate Check", desc: "AI verifies geo-proximity & similarity. Merges duplicates.", role: "citizen", view: "citizen" },
    { step: 5, title: "5. Map Placement", desc: "Pothole pin renders on Live City Map with glowing RED marker.", role: "citizen", view: "citizen" },
    { step: 6, title: "6. Admin Prioritization", desc: "Issue moves to top of Administrator Emergency Priority Queue.", role: "admin", view: "admin" },
    { step: 7, title: "7. Admin Assigns Worker", desc: "Administrator dispatches Crew Alpha (Asphalt Unit).", role: "admin", view: "admin" },
    { step: 8, title: "8. Smart Route Generated", desc: "System optimizes Traveling Salesperson crew repair route.", role: "worker", view: "worker" },
    { step: 9, title: "9. Worker Uploads After Photo", desc: "Worker completes repair and uploads evidence photo.", role: "worker", view: "worker" },
    { step: 10, title: "10. AI Vision Repair Verify", desc: "AI Vision compares Before vs After. Uniformity: 98.4%.", role: "worker", view: "worker" },
    { step: 11, title: "11. Ticket RESOLVED", desc: "Issue status changes to RESOLVED.", role: "worker", view: "worker" },
    { step: 12, title: "12. History Updated", desc: "Digital Location History logged & Civic Points awarded!", role: "admin", view: "admin" }
  ];

  const currentInfo = DEMO_STEPS.find(s => s.step === demoStep) || DEMO_STEPS[0];

  const handleNextStep = () => {
    const next = demoStep + 1;
    if (next > 12) {
      setIsDemoRunning(false);
      setDemoStep(0);
      return;
    }

    setDemoStep(next);

    // Auto switch views and perform mock actions per step
    const stepObj = DEMO_STEPS.find(s => s.step === next);
    if (stepObj) {
      setActiveView(stepObj.view);
      setUserRole(stepObj.role);
    }

    // Trigger mock actions at specific steps
    if (next === 7) {
      assignWorker("CG-2026-8801", "W-101");
    } else if (next === 10) {
      completeRepairWithAI("CG-2026-8801", "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80");
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-950 via-navy-900 to-indigo-950 border-b border-purple-500/40 px-4 py-3 text-white sticky top-16 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left Step Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-lg animate-pulse">
            {demoStep}/12
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-purple-200">{currentInfo.title}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 border border-purple-400/40">
                View: {currentInfo.view.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-300">{currentInfo.desc}</p>
          </div>
        </div>

        {/* Step Progress Bar & Buttons */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          
          <button
            onClick={handleNextStep}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-extrabold px-4 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-lg transition transform hover:scale-105"
          >
            <span>Advance Step ({demoStep < 12 ? demoStep + 1 : "Finish"})</span>
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsDemoRunning(false);
              setDemoStep(0);
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-navy-950 border border-slate-800 text-xs"
          >
            Exit Demo
          </button>

        </div>

      </div>
    </div>
  );
}
