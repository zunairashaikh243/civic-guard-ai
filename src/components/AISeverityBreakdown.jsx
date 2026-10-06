import React from 'react';
import { Activity, ShieldAlert, Users, CloudRain, Clock, MapPin } from 'lucide-react';

export default function AISeverityBreakdown({ issue }) {
  if (!issue) return null;

  const score = issue.severityScore || 50;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white">AI Multi-Factor Severity Diagnostics</h4>
        </div>
        <div className={`px-3 py-1 rounded-xl text-xs font-black tracking-wider ${
          issue.severityLevel === 'CRITICAL' ? 'bg-red-500/30 text-red-300 border border-red-500/50 shadow-glow-red' :
          issue.severityLevel === 'HIGH' ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50' :
          'bg-amber-500/30 text-amber-300 border border-amber-500/50'
        }`}>
          SCORE: {score} / 100 ({issue.severityLevel})
        </div>
      </div>

      {/* Progress Score Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>Priority Rating Index</span>
          <span className="text-cyan-400 font-bold">{score}% Priority Level</span>
        </div>
        <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              score >= 85 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
              score >= 65 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
              'bg-gradient-to-r from-emerald-500 to-cyan-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Multi-Factor Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-sans">
        
        {/* Category Impact */}
        <div className="bg-navy-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-cyan-400" />
            <span>Hazard Type</span>
          </div>
          <p className="font-bold text-slate-200 mt-1">{issue.category}</p>
          <span className="text-[9px] text-cyan-400 font-mono">+25 pts baseline</span>
        </div>

        {/* Traffic Density */}
        <div className="bg-navy-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Traffic Volume</span>
          </div>
          <p className="font-bold text-slate-200 mt-1">{issue.metrics?.trafficDensity || "High"}</p>
          <span className="text-[9px] text-cyan-400 font-mono">+18 pts impact</span>
        </div>

        {/* Sensitive Zone */}
        <div className="bg-navy-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Proximity Zone</span>
          </div>
          <p className="font-bold text-slate-200 mt-1 truncate">{issue.metrics?.nearbySensitivity || "School / Station"}</p>
          <span className="text-[9px] text-amber-400 font-mono">+15 pts hazard</span>
        </div>

        {/* Citizen Confirmations */}
        <div className="bg-navy-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
            <Users className="w-3 h-3 text-emerald-400" />
            <span>Confirmations</span>
          </div>
          <p className="font-bold text-slate-200 mt-1">{issue.confirmations || 1} Citizens</p>
          <span className="text-[9px] text-emerald-400 font-mono">+{Math.min(15, (issue.confirmations || 1) * 2)} pts boost</span>
        </div>

        {/* Weather Forecast */}
        <div className="bg-navy-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
            <CloudRain className="w-3 h-3 text-blue-400" />
            <span>Weather Forecast</span>
          </div>
          <p className="font-bold text-slate-200 mt-1">{issue.metrics?.weatherImpact || "Moderate Rain"}</p>
          <span className="text-[9px] text-blue-400 font-mono">+12 pts risk factor</span>
        </div>

        {/* Aging Elapsed Time */}
        <div className="bg-navy-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
            <Clock className="w-3 h-3 text-purple-400" />
            <span>Elapsed Time</span>
          </div>
          <p className="font-bold text-slate-200 mt-1">Unresolved 24h+</p>
          <span className="text-[9px] text-purple-400 font-mono">+10 pts aging</span>
        </div>

      </div>

    </div>
  );
}
