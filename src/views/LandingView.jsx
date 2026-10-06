import React from 'react';
import { useInfrastructure } from '../context/InfrastructureContext';
import { Shield, Sparkles, MapPin, Activity, CheckCircle2, ArrowRight, HardHat, Building2, User, PlayCircle, Eye, ShieldAlert, Cpu } from 'lucide-react';
import LeafletMap from '../components/LeafletMap';

export default function LandingView() {
  const { setActiveView, setUserRole, issues, setIsDemoRunning, setDemoStep } = useInfrastructure();

  const totalIssues = issues.length;
  const criticalCount = issues.filter(i => i.severityLevel === 'CRITICAL').length;
  const resolvedCount = issues.filter(i => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        
        {/* Glow Background Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          {/* Badge pill */}
          <div className="inline-flex items-center space-x-2 bg-navy-900/90 border border-cyan-500/40 px-4 py-1.5 rounded-full shadow-glow-cyan">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-300 font-mono tracking-wider">
              NEXT-GEN SMART CITY INFRASTRUCTURE INTELLIGENCE
            </span>
          </div>

          {/* Hero Headlines */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              See It. Detect It. <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Fix It.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              AI-powered infrastructure intelligence and predictive maintenance for safer, smarter cities. Automating defect detection, priority scoring, route optimization, and before/after repair verification.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => { setActiveView('citizen'); setUserRole('citizen'); }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold px-8 py-4 rounded-2xl text-sm tracking-wider uppercase shadow-glow-cyan transition transform hover:scale-105 flex items-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span>Report Infrastructure Issue</span>
            </button>

            <button
              onClick={() => { setActiveView('admin'); setUserRole('admin'); }}
              className="glass-panel hover:bg-navy-900 text-white border border-slate-700 hover:border-cyan-500/50 font-bold px-8 py-4 rounded-2xl text-sm transition flex items-center space-x-2"
            >
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span>Explore Live Control Center</span>
            </button>
          </div>

          {/* Live Metrics Ticker Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8">
            <div className="glass-panel p-4 rounded-2xl text-left border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Infrastructure Incidents</span>
              <div className="text-2xl font-extrabold text-white mt-1">{totalIssues} Nodes</div>
              <span className="text-[10px] text-cyan-400 font-mono">100% Computer Vision Monitored</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-left border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Critical Hazards</span>
              <div className="text-2xl font-extrabold text-red-400 mt-1">{criticalCount} Urgent</div>
              <span className="text-[10px] text-red-400 font-mono">Score 85–100 Priority</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-left border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Verified Repairs</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{resolvedCount} Closed</div>
              <span className="text-[10px] text-emerald-400 font-mono">AI Vision Verified</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-left border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">AI Accuracy Rate</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">96.8%</div>
              <span className="text-[10px] text-slate-400 font-mono">Defect Precision Index</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Infrastructure Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">REAL-TIME CITY GRID MONITORING</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Live Smart City Infrastructure Map</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Click on any marker pin to view real-time AI severity scores, citizen confirmations, worker assignments, and early risk predictions.
          </p>
        </div>

        <LeafletMap onSelectIssue={() => setActiveView('admin')} />
      </section>

      {/* Workflow Cycle (Detect -> Predict -> Route -> Verify) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">THE CIVICGUARD AI ARCHITECTURE</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Not Just a Complaint App — An Infrastructure Intelligence System
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Detect & Duplicate Aggregation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Computer Vision classifies defects with bounding boxes. Geo-similarity algorithms prevent duplicate complaints by merging citizen reports and boosting priority.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-white">AI Risk Prediction (0–100)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Multi-factor engine evaluates damage size, traffic volume, school/hospital proximity, weather forecasts, and aging to trigger early preventive maintenance.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Smart Route & AI Verification</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generates energy-efficient Traveling Salesperson crew repair routes. Requires Before/After photo comparison before ticket auto-closure.
            </p>
          </div>

        </div>
      </section>

      {/* Role Switcher Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card-glow p-8 rounded-3xl border border-cyan-500/30 text-center space-y-6">
          <h3 className="text-2xl font-extrabold text-white">Experience CivicGuard AI for All 3 User Roles</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <button
              onClick={() => { setActiveView('citizen'); setUserRole('citizen'); }}
              className="bg-navy-950 hover:bg-navy-900 border border-slate-700 hover:border-cyan-400 p-5 rounded-2xl text-left space-y-2 transition group"
            >
              <User className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition" />
              <div className="font-bold text-white text-base">Citizen Portal</div>
              <p className="text-xs text-slate-400">Upload photos, track status, upvote issues, and earn Civic Points & Badges.</p>
            </button>

            <button
              onClick={() => { setActiveView('worker'); setUserRole('worker'); }}
              className="bg-navy-950 hover:bg-navy-900 border border-slate-700 hover:border-cyan-400 p-5 rounded-2xl text-left space-y-2 transition group"
            >
              <HardHat className="w-6 h-6 text-amber-400 group-hover:scale-110 transition" />
              <div className="font-bold text-white text-base">Municipal Worker</div>
              <p className="text-xs text-slate-400">View assigned tasks, generate smart repair routes, and upload Before/After photos.</p>
            </button>

            <button
              onClick={() => { setActiveView('admin'); setUserRole('admin'); }}
              className="bg-navy-950 hover:bg-navy-900 border border-slate-700 hover:border-cyan-400 p-5 rounded-2xl text-left space-y-2 transition group"
            >
              <Building2 className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition" />
              <div className="font-bold text-white text-base">Administrator</div>
              <p className="text-xs text-slate-400">Monitor live map control center, dispatch crews, view analytics, and audit history.</p>
            </button>

          </div>
        </div>
      </section>

    </div>
  );
}
