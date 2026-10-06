import React from 'react';
import { Shield, Cpu, Activity, MapPin, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-slate-800/80 text-slate-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-extrabold text-base tracking-tight">CivicGuard AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered infrastructure intelligence and predictive maintenance platform. Transforming public complaint management into proactive smart-city maintenance.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-cyan-400 font-mono">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>System Status: 99.98% Operational</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">AI Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5 hover:text-cyan-400 cursor-pointer">
                <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                <span>Computer Vision Defect Detection</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-cyan-400 cursor-pointer">
                <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                <span>0–100 Multi-Factor Severity Scoring</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-cyan-400 cursor-pointer">
                <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                <span>Early Risk Predictive Maintenance</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-cyan-400 cursor-pointer">
                <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                <span>Duplicate Report Aggregator</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-cyan-400 cursor-pointer">
                <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                <span>Before/After Repair Vision Verification</span>
              </li>
            </ul>
          </div>

          {/* Smart City Coverage */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">City Infrastructure</h4>
            <ul className="space-y-2 text-xs">
              <li>Potholes & Road Foundation</li>
              <li>Thermal Road Cracks</li>
              <li>Public LED Lighting Grids</li>
              <li>Storm Drain & Sewer Drainage</li>
              <li>Traffic Safety & Signal Poles</li>
              <li>Urban Sanitation Hotspots</li>
            </ul>
          </div>

          {/* Hackathon Specs */}
          <div className="glass-panel p-4 rounded-xl border border-cyan-500/20">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Unique Differentiator</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
              Detect → Verify → Prioritize → Predict → Assign → Route → Repair → Verify → Learn
            </p>
            <div className="mt-3 text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
              <span>Smart City Platform v2.4</span>
              <span className="text-cyan-400 font-bold">Metro City Edition</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800/60 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 CivicGuard AI Platform. All rights reserved.</span>
          <span className="font-mono text-cyan-500/80">Designed for Next-Gen Smart Municipal Governance</span>
        </div>
      </div>
    </footer>
  );
}
