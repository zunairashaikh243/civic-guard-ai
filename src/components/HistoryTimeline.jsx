import React, { useState } from 'react';
import { useInfrastructure } from '../context/InfrastructureContext';
import { History, AlertOctagon, CheckCircle2, Calendar, Search, MapPin } from 'lucide-react';

export default function HistoryTimeline() {
  const { digitalHistories } = useInfrastructure();
  const [selectedLocationIdx, setSelectedLocationIdx] = useState(0);

  const activeHistory = digitalHistories[selectedLocationIdx] || digitalHistories[0];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Digital Infrastructure Maintenance History</h4>
            <p className="text-[10px] text-slate-400 font-mono">Location Maintenance Audit & Recurring Failure Detector</p>
          </div>
        </div>

        {/* Location Selector */}
        <select
          value={selectedLocationIdx}
          onChange={(e) => setSelectedLocationIdx(Number(e.target.value))}
          className="bg-navy-950 border border-slate-800 text-cyan-300 text-xs px-3 py-1 rounded-xl focus:outline-none"
        >
          {digitalHistories.map((loc, idx) => (
            <option key={idx} value={idx}>{loc.location}</option>
          ))}
        </select>
      </div>

      {/* Recurring Failure Flag Alert */}
      {activeHistory.isRecurring && (
        <div className="bg-red-950/40 border border-red-500/40 p-3.5 rounded-xl space-y-1 text-xs">
          <div className="flex items-center space-x-2 text-red-300 font-bold">
            <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
            <span>⚠️ RECURRING INFRASTRUCTURE FAILURE DETECTED</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {activeHistory.recommendation}
          </p>
        </div>
      )}

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {activeHistory.history.map((item, idx) => (
          <div key={idx} className="relative flex items-start space-x-3 text-xs">
            
            {/* Timeline Node Icon */}
            <div className={`absolute -left-6 top-0.5 w-3 h-3 rounded-full border-2 border-navy-950 ${
              item.status === 'OPEN' ? 'bg-red-500 ring-4 ring-red-500/20' : 'bg-cyan-500'
            }`} />

            <div className="bg-navy-950/90 p-3 rounded-xl border border-slate-800 w-full space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>{item.date}</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  item.status === 'OPEN' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {item.status}
                </span>
              </div>
              
              <div className="font-bold text-white text-sm">{item.category}</div>
              <p className="text-slate-300 text-[11px] font-mono">{item.action}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
