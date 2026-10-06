import React, { useState } from 'react';
import { useInfrastructure } from '../context/InfrastructureContext';
import SmartRouteViewer from '../components/SmartRouteViewer';
import BeforeAfterCompare from '../components/BeforeAfterCompare';
import LeafletMap from '../components/LeafletMap';
import { HardHat, Navigation, CheckCircle2, Clock, MapPin, Upload, Sparkles, Filter } from 'lucide-react';

export default function WorkerPortal() {
  const { issues, selectedIssue, setSelectedIssue, workers } = useInfrastructure();
  
  const [selectedWorkerId, setSelectedWorkerId] = useState("W-101");
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'route', 'map', 'repair-verify'

  const activeWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  // Assigned issues for active worker
  const assignedIssues = issues.filter(i => i.assignedWorkerId === selectedWorkerId || i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-amber-500/30">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Municipal Field Crew Dispatch & Repair Dashboard</h1>
            <p className="text-xs text-slate-400 font-mono">Assigned Maintenance Tasks, AI Route Optimization & Evidence Upload</p>
          </div>
        </div>

        {/* Crew Switcher */}
        <div className="flex items-center space-x-2 bg-navy-950 p-2 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-mono">Crew Unit:</span>
          <select
            value={selectedWorkerId}
            onChange={(e) => setSelectedWorkerId(e.target.value)}
            className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
          >
            {workers.map(w => (
              <option key={w.id} value={w.id}>{w.name} ({w.sector})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Worker Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-navy-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold w-fit">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'tasks' ? 'bg-amber-500 text-navy-950 font-bold shadow-md' : 'text-slate-300 hover:text-white'
          }`}
        >
          📋 Task Queue ({assignedIssues.length})
        </button>
        <button
          onClick={() => setActiveTab('route')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'route' ? 'bg-amber-500 text-navy-950 font-bold shadow-md' : 'text-slate-300 hover:text-white'
          }`}
        >
          🗺️ Smart Crew Repair Route
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'map' ? 'bg-amber-500 text-navy-950 font-bold shadow-md' : 'text-slate-300 hover:text-white'
          }`}
        >
          🌐 Sector Task Map
        </button>
      </div>

      {/* TAB 1: ASSIGNED TASK QUEUE */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Task List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>Assigned Infrastructure Tasks</span>
                <span className="text-xs font-mono text-slate-400">{assignedIssues.length} Pending Actions</span>
              </h3>

              {assignedIssues.length === 0 ? (
                <div className="glass-panel p-8 text-center text-slate-400 text-xs rounded-2xl space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p>All sector tasks cleared! No pending maintenance tickets assigned.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignedIssues.map(issue => (
                    <div 
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`glass-panel p-4 rounded-2xl border transition cursor-pointer ${
                        selectedIssue?.id === issue.id ? 'border-cyan-400 shadow-glow-cyan bg-navy-900/90' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400 font-mono">#{issue.id}</span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono ${
                          issue.severityLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          issue.severityLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          Severity: {issue.severityScore} ({issue.severityLevel})
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-base mt-2">{issue.title}</h4>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">📍 {issue.location}</p>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono text-[10px]">Action: {issue.recommendedAction}</span>
                        <span className="text-amber-400 font-bold hover:underline text-[11px]">
                          Select for AI Verify →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Selected Issue Before/After AI Verification Tool */}
            <div>
              {selectedIssue ? (
                <BeforeAfterCompare issue={selectedIssue} />
              ) : (
                <div className="glass-panel p-8 text-center text-slate-400 text-xs rounded-2xl space-y-2">
                  <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />
                  <p>Select a maintenance task from the queue to upload repair photo and execute AI Verification.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: SMART CREW REPAIR ROUTE */}
      {activeTab === 'route' && (
        <div className="space-y-6">
          <SmartRouteViewer assignedIssues={assignedIssues} workerName={activeWorker.name} />
        </div>
      )}

      {/* TAB 3: SECTOR MAP */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Live Municipal Crew Sector Map</h3>
          <LeafletMap />
        </div>
      )}

    </div>
  );
}
