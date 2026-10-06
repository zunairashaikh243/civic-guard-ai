import React from 'react';
import { useInfrastructure } from '../context/InfrastructureContext';
import { Award, ShieldCheck, HeartHandshake, Eye, Trophy, Sparkles } from 'lucide-react';

export default function CivicPointsBadge() {
  const { civicPoints, badges } = useInfrastructure();

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Eye': return <Eye className="w-5 h-5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Civic Participation & Gamification</h4>
            <p className="text-[10px] text-slate-400 font-mono">Community Impact & Guardian Rewards</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xl font-extrabold text-amber-300 font-mono">{civicPoints}</span>
          <span className="text-[10px] text-slate-400 block font-mono">CIVIC POINTS</span>
        </div>
      </div>

      {/* Points Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>Rank Progress: City Guardian</span>
          <span className="text-amber-400 font-bold">{civicPoints} / 500 Pts</span>
        </div>
        <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
            style={{ width: `${Math.min(100, (civicPoints / 500) * 100)}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`p-3 rounded-xl border text-center space-y-1.5 transition ${
              badge.unlocked 
                ? 'bg-navy-950 border-amber-500/40 text-amber-300 shadow-md' 
                : 'bg-navy-950/40 border-slate-800 text-slate-600 opacity-60'
            }`}
          >
            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center bg-gradient-to-br ${badge.color} text-navy-950 shadow-md`}>
              {getIcon(badge.icon)}
            </div>
            <div className="font-bold text-xs text-white">{badge.title}</div>
            <p className="text-[9px] text-slate-400 leading-tight">{badge.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
