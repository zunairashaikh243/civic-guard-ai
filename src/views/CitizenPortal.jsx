import React, { useState } from 'react';
import { useInfrastructure } from '../context/InfrastructureContext';
import AIDetectionScanner from '../components/AIDetectionScanner';
import CivicPointsBadge from '../components/CivicPointsBadge';
import LeafletMap from '../components/LeafletMap';
import { User, Camera, ThumbsUp, CheckCircle2, Clock, AlertTriangle, MapPin, Search } from 'lucide-react';

export default function CitizenPortal() {
  const { issues, selectedIssue, setSelectedIssue, confirmExistingIssue, civicPoints } = useInfrastructure();
  
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'nearby', 'my-reports', 'rewards'
  const [duplicateAlert, setDuplicateAlert] = useState(null);

  // Handle scan complete result
  const handleScanComplete = (result) => {
    if (result.isDuplicate) {
      setDuplicateAlert(result);
    } else {
      setDuplicateAlert(null);
      setActiveTab('my-reports');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cyan-500/30">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Citizen Infrastructure Intelligence Portal</h1>
            <p className="text-xs text-slate-400 font-mono">Report defects, confirm issues, track repair lifecycle & earn Civic Points</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 bg-navy-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'report' ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            📸 Report Issue
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'nearby' ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            🗺️ Nearby Map
          </button>
          <button
            onClick={() => setActiveTab('my-reports')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'my-reports' ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            📋 Track Status ({issues.length})
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'rewards' ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            🏆 Civic Rewards ({civicPoints} Pts)
          </button>
        </div>
      </div>

      {/* Duplicate Alert Banner */}
      {duplicateAlert && (
        <div className="bg-amber-950/40 border border-amber-500/50 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-200 animate-fade-in">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{duplicateAlert.message}</span>
          </div>
          <button 
            onClick={() => setDuplicateAlert(null)} 
            className="text-amber-400 font-bold underline ml-4 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: REPORT ISSUE WITH AI SCANNER */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <AIDetectionScanner onScanComplete={handleScanComplete} />
        </div>
      )}

      {/* TAB 2: NEARBY INFRASTRUCTURE MAP */}
      {activeTab === 'nearby' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Nearby Verified Infrastructure Issues</h3>
          <LeafletMap />
        </div>
      )}

      {/* TAB 3: TRACK COMPLAINT STATUS */}
      {activeTab === 'my-reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Community & My Complaints Tracker</h3>
            <span className="text-xs text-slate-400 font-mono">Showing {issues.length} active nodes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues.map(issue => (
              <div 
                key={issue.id} 
                className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/30 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">#{issue.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    issue.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    issue.status === 'IN_PROGRESS' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {issue.status}
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <img src={issue.imageUrl} alt={issue.title} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">{issue.title}</h4>
                    <div className="text-[11px] text-slate-400 font-mono">📍 {issue.location}</div>
                    <div className="text-[10px] text-amber-400 font-bold">
                      Severity: {issue.severityScore}/100 ({issue.severityLevel})
                    </div>
                  </div>
                </div>

                {/* Complaint Lifecycle Stepper */}
                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>Reported → AI Verified → Assigned → Repairing → Resolved</span>
                  </div>
                </div>

                {/* Confirm / Upvote Button */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">👥 {issue.confirmations} Confirmations</span>
                  <button
                    onClick={() => confirmExistingIssue(issue.id)}
                    className="bg-navy-950 hover:bg-navy-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Confirm / Upvote (+15 Pts)</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CIVIC REWARDS */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <CivicPointsBadge />
        </div>
      )}

    </div>
  );
}
