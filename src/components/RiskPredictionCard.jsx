import React from 'react';
import { AlertTriangle, TrendingUp, DollarSign, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RiskPredictionCard({ issue }) {
  if (!issue || !issue.predictiveRisk) return null;

  const risk = issue.predictiveRisk;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-navy-900/80 to-navy-950 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>AI Risk Prediction & Early Warning</span>
            </h4>
            <p className="text-[10px] font-mono text-amber-400">Predictive Infrastructure Maintenance Layer</p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono tracking-wider ${
          risk.riskLevel === 'CRITICAL' ? 'bg-red-500/30 text-red-400 border border-red-500/50 animate-pulse' :
          'bg-amber-500/30 text-amber-400 border border-amber-500/50'
        }`}>
          Risk Level: {risk.riskLevel}
        </span>
      </div>

      {/* Main Early Warning Prediction Callout */}
      <div className="bg-navy-950/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
        <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span>Predicted Structural Degradation Outcome:</span>
        </div>
        <p className="text-xs text-amber-200 font-medium leading-relaxed">
          "{risk.predictedOutcome}"
        </p>
      </div>

      {/* Financial ROI Comparison Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        
        {/* Preventive Maintenance Cost */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl space-y-1">
          <div className="text-[10px] font-mono text-emerald-400 uppercase flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Preventive Action Cost</span>
          </div>
          <div className="text-base font-extrabold text-emerald-300">{risk.preventiveCost}</div>
          <p className="text-[10px] text-slate-400">Early intervention before complete road failure.</p>
        </div>

        {/* Complete Collapse Cost */}
        <div className="bg-red-950/30 border border-red-500/30 p-3 rounded-xl space-y-1">
          <div className="text-[10px] font-mono text-red-400 uppercase flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Unattended Failure Cost</span>
          </div>
          <div className="text-base font-extrabold text-red-300">{risk.failureCost}</div>
          <p className="text-[10px] text-slate-400">Emergency excavation, lane closures & claims.</p>
        </div>

      </div>

    </div>
  );
}
