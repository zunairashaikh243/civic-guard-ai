import React, { useState } from 'react';
import { useInfrastructure } from '../context/InfrastructureContext';
import { CheckCircle2, AlertTriangle, Upload, Eye, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';

export default function BeforeAfterCompare({ issue }) {
  const { completeRepairWithAI } = useInfrastructure();
  
  const [afterImage, setAfterImage] = useState(issue?.afterImageUrl || null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  if (!issue) return null;

  // Handle uploading after image
  const handleUploadAfterImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAfterImage(url);
    }
  };

  // Run AI Repair Verification
  const handleRunVerification = () => {
    if (!afterImage) return;
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const res = completeRepairWithAI(issue.id, afterImage);
      setVerificationResult(res);
    }, 1200);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white">Before / After AI Vision Repair Verification</h4>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Ticket #{issue.id}
        </span>
      </div>

      {/* Image Split View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* BEFORE IMAGE */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-red-400 font-bold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>BEFORE REPAIR (Reported Defect)</span>
            </span>
            <span className="text-slate-500">Oct 5, 2026</span>
          </div>
          <div className="h-52 rounded-xl overflow-hidden bg-navy-950 border border-slate-800 relative">
            <img src={issue.imageUrl} alt="Before Repair" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-navy-950/90 text-red-400 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
              Defect: {issue.category}
            </div>
          </div>
        </div>

        {/* AFTER IMAGE */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>AFTER REPAIR (Worker Evidence)</span>
            </span>
            <span className="text-slate-500">{afterImage ? "Uploaded" : "Pending Upload"}</span>
          </div>
          <div className="h-52 rounded-xl overflow-hidden bg-navy-950 border border-slate-800 relative flex items-center justify-center">
            {afterImage ? (
              <img src={afterImage} alt="After Repair" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center space-y-2 p-4">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto opacity-70" />
                <p className="text-xs text-slate-400">Worker evidence photo required</p>
                <label className="inline-block bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition shadow-glow-cyan">
                  Select After Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleUploadAfterImage} />
                </label>
              </div>
            )}
            
            {afterImage && (
              <label className="absolute bottom-2 right-2 bg-navy-950/90 hover:bg-navy-900 text-cyan-300 text-[10px] px-2 py-1 rounded border border-slate-700 cursor-pointer font-mono">
                Change Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadAfterImage} />
              </label>
            )}
          </div>
        </div>

      </div>

      {/* AI Verification Controls & Results */}
      {afterImage && (
        <div className="pt-3 border-t border-slate-800 space-y-3">
          
          {!verificationResult ? (
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-navy-950 font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Computer Vision Analyzing Surfaces...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Repair Verification & Close Ticket</span>
                </>
              )}
            </button>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{verificationResult.statusText}</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                  Confidence: {verificationResult.confidenceScore}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-1">
                <div>• Surface Uniformity: <span className="text-emerald-400 font-bold">{verificationResult.surfaceUniformityScore}%</span></div>
                <div>• Debris Clearance: <span className="text-emerald-400 font-bold">{verificationResult.debrisClearanceScore}%</span></div>
              </div>
              <p className="text-[11px] text-slate-400 italic border-t border-emerald-900/60 pt-1">
                {verificationResult.recommendation}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
