import React, { useState } from 'react';
import { useInfrastructure } from '../context/InfrastructureContext';
import AISeverityBreakdown from '../components/AISeverityBreakdown';
import RiskPredictionCard from '../components/RiskPredictionCard';
import HistoryTimeline from '../components/HistoryTimeline';
import LeafletMap from '../components/LeafletMap';
import { Building2, ShieldAlert, Users, Activity, CheckCircle2, AlertOctagon, TrendingUp, BarChart3, PieChart as PieIcon, MapPin, Clock, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const { issues, selectedIssue, setSelectedIssue, assignWorker, workers, emergencyAlert } = useInfrastructure();
  
  const [activeTab, setActiveTab] = useState('control'); // 'control', 'queue', 'analytics', 'history'
  const [selectedWorkerForAssign, setSelectedWorkerForAssign] = useState("W-101");

  // Sorted by AI Severity Score (0-100) descending
  const sortedIssues = [...issues].sort((a, b) => b.severityScore - a.severityScore);

  const total = issues.length;
  const critical = issues.filter(i => i.severityLevel === 'CRITICAL').length;
  const high = issues.filter(i => i.severityLevel === 'HIGH').length;
  const resolved = issues.filter(i => i.status === 'RESOLVED').length;
  const pending = issues.filter(i => i.status !== 'RESOLVED').length;

  // Chart data setup
  const categoryData = [
    { name: 'Potholes', count: issues.filter(i => i.category === 'Pothole').length },
    { name: 'Road Cracks', count: issues.filter(i => i.category === 'Road crack').length },
    { name: 'Streetlights', count: issues.filter(i => i.category === 'Broken streetlight').length },
    { name: 'Drains', count: issues.filter(i => i.category.includes('drain')).length },
    { name: 'Garbage', count: issues.filter(i => i.category === 'Garbage accumulation').length },
    { name: 'Signs', count: issues.filter(i => i.category.includes('sign')).length }
  ];

  const severityChartData = [
    { name: 'Critical (85-100)', value: critical, color: '#EF4444' },
    { name: 'High (65-84)', value: high, color: '#F97316' },
    { name: 'Medium (40-64)', value: issues.filter(i => i.severityLevel === 'MEDIUM').length, color: '#F59E0B' },
    { name: 'Resolved', value: resolved, color: '#10B981' }
  ];

  const targetIssue = selectedIssue || sortedIssues[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cyan-500/30">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Administrator Infrastructure Intelligence Control Center</h1>
            <p className="text-xs text-slate-400 font-mono">Live City Monitoring, AI Severity Auto-Sorting, Crew Dispatch & Predictive Analytics</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-navy-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('control')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'control' ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            🏛️ Live Control Center
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'queue' ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            🔴 AI Priority Queue ({sortedIssues.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'analytics' ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            📊 Analytics & Trends
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'history' ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            📜 Digital History Audit
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Incidents</span>
          <div className="text-xl font-extrabold text-white mt-0.5">{total}</div>
          <span className="text-[9px] text-slate-500 font-mono">100% Computer Vision</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-red-500/30">
          <span className="text-[10px] text-red-400 font-mono uppercase block">Critical (85+)</span>
          <div className="text-xl font-extrabold text-red-400 mt-0.5">{critical}</div>
          <span className="text-[9px] text-red-400 font-mono">Emergency Escalation</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-orange-500/30">
          <span className="text-[10px] text-orange-400 font-mono uppercase block">High Risk (65+)</span>
          <div className="text-xl font-extrabold text-orange-400 mt-0.5">{high}</div>
          <span className="text-[9px] text-orange-400 font-mono">Prioritized Queue</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-amber-500/30">
          <span className="text-[10px] text-amber-400 font-mono uppercase block">Pending Repairs</span>
          <div className="text-xl font-extrabold text-amber-400 mt-0.5">{pending}</div>
          <span className="text-[9px] text-amber-400 font-mono">In Workflow</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-emerald-500/30">
          <span className="text-[10px] text-emerald-400 font-mono uppercase block">Resolved & Verified</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{resolved}</div>
          <span className="text-[9px] text-emerald-400 font-mono">AI Vision Confirmed</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-cyan-500/30">
          <span className="text-[10px] text-cyan-400 font-mono uppercase block">Avg Repair Time</span>
          <div className="text-xl font-extrabold text-cyan-300 mt-0.5">18.4 hrs</div>
          <span className="text-[9px] text-cyan-400 font-mono">-35% Response Time</span>
        </div>
      </div>

      {/* TAB 1: LIVE CONTROL CENTER */}
      {activeTab === 'control' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Live City Map */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-white">Live City Infrastructure Map Control Center</h3>
              <LeafletMap onSelectIssue={(i) => setSelectedIssue(i)} />
            </div>

            {/* Right Col: Selected Issue Inspection & Dispatcher */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Selected Incident Inspection & Dispatch</h3>

              {targetIssue ? (
                <div className="space-y-4">
                  {/* AI Severity Card */}
                  <AISeverityBreakdown issue={targetIssue} />

                  {/* Predictive Risk Warning */}
                  <RiskPredictionCard issue={targetIssue} />

                  {/* Worker Dispatcher Card */}
                  <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-white uppercase font-mono block">Worker Crew Dispatcher</span>
                    
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-400 font-mono block">Assign Municipal Field Unit:</label>
                      <select
                        value={selectedWorkerForAssign}
                        onChange={(e) => setSelectedWorkerForAssign(e.target.value)}
                        className="w-full bg-navy-950 border border-slate-700 text-white text-xs p-2 rounded-xl font-semibold"
                      >
                        {workers.map(w => (
                          <option key={w.id} value={w.id}>{w.name} ({w.sector})</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => assignWorker(targetIssue.id, selectedWorkerForAssign)}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-glow-cyan"
                    >
                      Dispatch Crew to Ticket #{targetIssue.id}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: AI PRIORITY QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">AI Auto-Sorted Priority Queue (0–100 Severity Score)</h3>
            <span className="text-xs text-slate-400 font-mono">Automatically sorted by risk & impact</span>
          </div>

          <div className="space-y-3">
            {sortedIssues.map((issue, idx) => (
              <div 
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className={`glass-panel p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  selectedIssue?.id === issue.id ? 'border-cyan-400 shadow-glow-cyan bg-navy-900' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white font-extrabold text-sm shrink-0 ${
                    issue.severityLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-glow-red' :
                    issue.severityLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  }`}>
                    <span className="text-[10px] uppercase font-mono opacity-80">Rank #{idx + 1}</span>
                    <span>{issue.severityScore}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-base">{issue.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        {issue.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      📍 {issue.location} • 👥 {issue.confirmations} Confirmations • {issue.assignedWorkerName || "Unassigned"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded text-xs font-extrabold font-mono uppercase ${
                    issue.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {issue.status}
                  </span>
                  <button className="bg-navy-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 text-xs px-3 py-1.5 rounded-xl font-bold transition">
                    Inspect Diagnostics →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Bar chart categories */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Infrastructure Issues by Category</span>
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Severity Distribution Pie */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <PieIcon className="w-4 h-4 text-amber-400" />
                <span>Severity Distribution Breakdown</span>
              </h4>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={severityChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {severityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL HISTORY AUDIT */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <HistoryTimeline />
        </div>
      )}

    </div>
  );
}
