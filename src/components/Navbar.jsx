import React, { useState } from 'react';
import { useInfrastructure } from '../context/InfrastructureContext';
import { Shield, Bell, Award, User, HardHat, Building2, PlayCircle, RotateCcw } from 'lucide-react';

export default function Navbar() {
  const {
    setUserRole,
    activeView,
    setActiveView,
    civicPoints,
    notifications,
    emergencyAlert,
    setIsDemoRunning,
    setDemoStep,
    resetData,
    dataMode,
    mapboxToken
  } = useInfrastructure();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-slate-800/80">
      {emergencyAlert.active && (
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-red-100 px-4 py-1.5 text-xs font-medium flex items-center justify-between border-b border-red-800/50">
          <div className="flex items-center space-x-2 animate-pulse">
            <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">🚨 Emergency Alert</span>
            <span className="truncate">{emergencyAlert.message}</span>
          </div>
          <button onClick={() => setActiveView('admin')} className="hidden sm:inline-flex items-center text-red-200 underline hover:text-white font-semibold ml-4 shrink-0 text-[11px]">Take Action in Control Center →</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('landing')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow-cyan">
            <Shield className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-navy-950 animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">CivicGuard</span>
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">Smart Infrastructure Intelligence</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1 bg-navy-900/90 p-1 rounded-xl border border-slate-800">
          <button onClick={() => setActiveView('landing')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === 'landing' ? 'bg-cyan-500 text-navy-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}>Overview</button>
          <button onClick={() => { setActiveView('citizen'); setUserRole('citizen'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${activeView === 'citizen' ? 'bg-cyan-500 text-navy-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}><User className="w-3.5 h-3.5" /><span>Citizen Portal</span></button>
          <button onClick={() => { setActiveView('worker'); setUserRole('worker'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${activeView === 'worker' ? 'bg-cyan-500 text-navy-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}><HardHat className="w-3.5 h-3.5" /><span>Worker Crew</span></button>
          <button onClick={() => { setActiveView('admin'); setUserRole('admin'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${activeView === 'admin' ? 'bg-cyan-500 text-navy-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}><Building2 className="w-3.5 h-3.5" /><span>Admin Control</span></button>
        </nav>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${dataMode === 'LIVE DATA' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/50 bg-amber-500/10 text-amber-300'}`}>
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-current animate-pulse" />
            {dataMode}
          </span>

          {mapboxToken && (
            <span className="hidden lg:inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
              MAPBOX ON
            </span>
          )}

          <button onClick={() => { setIsDemoRunning(true); setDemoStep(1); setActiveView('citizen'); }} className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-purple-900/30 transition-all transform hover:scale-105"><PlayCircle className="w-4 h-4 animate-spin-slow" /><span className="hidden sm:inline">Hackathon Demo Mode</span></button>

          <div className="hidden lg:flex items-center space-x-1.5 bg-navy-900 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300">{civicPoints}</span>
            <span className="text-[10px] text-slate-400 uppercase font-mono">Pts</span>
          </div>

          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-navy-950 font-bold text-[9px] rounded-full flex items-center justify-center">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-navy-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center space-x-1"><Bell className="w-3.5 h-3.5 text-cyan-400" /><span>Live Intelligence Alerts</span></span>
                  <span className="text-[10px] text-slate-400 font-mono">{notifications.length} alerts</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-navy-950/80 border border-slate-800/60 text-xs">
                      <p className="text-slate-200">{n.text}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block font-mono">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={resetData} title="Reset Sample Data" className="p-2 rounded-lg bg-navy-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900 transition"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </div>
    </header>
  );
}
