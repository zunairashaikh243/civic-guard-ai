import React, { useState } from 'react';
import { generateOptimizedRoute } from '../utils/routeOptimizer';
import { Navigation, MapPin, Clock, Fuel, CheckCircle, ArrowRight } from 'lucide-react';

export default function SmartRouteViewer({ assignedIssues, workerName = "Crew Alpha" }) {
  const [isOptimized, setIsOptimized] = useState(true);

  // Generate route sequence
  const routeData = generateOptimizedRoute(assignedIssues);

  if (!assignedIssues || assignedIssues.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl text-center space-y-2 border border-slate-800">
        <Navigation className="w-8 h-8 text-cyan-400 mx-auto opacity-60" />
        <p className="text-xs text-slate-300">No active maintenance tasks assigned to generate route.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Smart AI Crew Repair Route</h4>
            <p className="text-[10px] text-slate-400 font-mono">Traveling Salesperson Optimization Engine</p>
          </div>
        </div>

        <button
          onClick={() => setIsOptimized(!isOptimized)}
          className="bg-navy-950 hover:bg-navy-900 border border-slate-700 text-cyan-300 text-xs px-3 py-1 rounded-xl transition font-mono"
        >
          {isOptimized ? "✓ Route Optimized" : "Re-Calculate Route"}
        </button>
      </div>

      {/* Route Metrics Summary Banner */}
      <div className="grid grid-cols-3 gap-3 text-xs bg-navy-950/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Distance</span>
            <span className="font-extrabold text-white">{routeData.totalDistanceKm} km</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Est. Time</span>
            <span className="font-extrabold text-white">~{routeData.estimatedTimeMinutes} mins</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Fuel className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Fuel Saved</span>
            <span className="font-extrabold text-emerald-400">+{routeData.fuelSavingsLitres} L</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Sequence List */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Optimized Maintenance Sequence:</span>
          <span>Start: Central Municipal Depot</span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {routeData.route.map((stepItem, idx) => (
            <div key={idx} className="bg-navy-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs hover:border-cyan-500/40 transition">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold font-mono flex items-center justify-center shrink-0">
                  {stepItem.step}
                </div>
                <div>
                  <div className="font-bold text-white flex items-center space-x-2">
                    <span>{stepItem.issue.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{stepItem.issue.category}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    📍 {stepItem.issue.location} • Severity: {stepItem.issue.severityScore}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono shrink-0">
                <span className="text-[11px] text-cyan-400 font-bold block">{stepItem.estimatedArrival}</span>
                <span className="text-[9px] text-slate-500">{stepItem.distanceFromPrevKm} km leg</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
