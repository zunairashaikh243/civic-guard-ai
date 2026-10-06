import React, { useState } from 'react';
import { SAMPLE_DETECTION_PRESETS } from '../data/mockData';
import { useInfrastructure } from '../context/InfrastructureContext';
import { Camera, Scan, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Upload, Layers } from 'lucide-react';

export default function AIDetectionScanner({ onScanComplete }) {
  const { submitComplaint } = useInfrastructure();
  
  const [selectedPreset, setSelectedPreset] = useState(SAMPLE_DETECTION_PRESETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // Custom Form fields
  const [locationText, setLocationText] = useState("Grand Avenue & 14th St (Sector 4)");
  const [trafficDensity, setTrafficDensity] = useState("High");
  const [isNearSensitiveZone, setIsNearSensitiveZone] = useState(true);

  // Trigger Simulated Computer Vision Scan
  const handleRunScan = (preset = selectedPreset) => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        category: preset.category,
        confidence: preset.confidence,
        severityScore: preset.severityScore,
        severityLevel: preset.severityLevel,
        recommendedAction: preset.recommendedAction,
        imageUrl: uploadedImage || preset.imageUrl,
        bbox: preset.bbox
      });
    }, 1400); // 1.4s realistic scanning delay
  };

  // Handle file upload preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      const customPreset = {
        label: "User Uploaded Defect",
        category: "Pothole",
        confidence: 94,
        severityScore: 88,
        severityLevel: "CRITICAL",
        recommendedAction: "Emergency repair recommended within 24 hours.",
        imageUrl: url,
        bbox: { top: 30, left: 25, width: 45, height: 40 }
      };
      setSelectedPreset(customPreset);
      handleRunScan(customPreset);
    }
  };

  // Submit Complaint to Global System
  const handleSubmitReport = () => {
    if (!scanResult) return;

    const result = submitComplaint({
      category: scanResult.category,
      title: `${scanResult.category} Hazard on ${locationText.split('&')[0]}`,
      description: `AI Detected ${scanResult.category} with ${scanResult.confidence}% confidence. Severity Score: ${scanResult.severityScore}.`,
      location: locationText,
      lat: 40.7128 + (Math.random() - 0.5) * 0.02,
      lng: -74.0060 + (Math.random() - 0.5) * 0.02,
      trafficDensity,
      isNearSensitiveZone,
      confidence: scanResult.confidence,
      imageUrl: scanResult.imageUrl
    });

    if (onScanComplete) onScanComplete(result);
  };

  return (
    <div className="glass-card-glow rounded-2xl p-6 border border-cyan-500/30">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Scan className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>AI Vision Infrastructure Scanner</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400 font-mono">Real-time Defect Classification & Severity Engine</p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="hidden md:flex items-center space-x-1.5 bg-navy-950 p-1 rounded-xl border border-slate-800 text-xs">
          {SAMPLE_DETECTION_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPreset(preset);
                setUploadedImage(null);
                handleRunScan(preset);
              }}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                selectedPreset.category === preset.category && !uploadedImage 
                  ? 'bg-cyan-500 text-navy-950 font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {preset.category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Image Viewport & Scanner Bounding Box */}
        <div className="relative rounded-2xl overflow-hidden bg-navy-950 border border-slate-800 h-[340px] flex items-center justify-center group">
          <img 
            src={uploadedImage || selectedPreset.imageUrl} 
            alt="Infrastructure Defect"
            className="w-full h-full object-cover"
          />

          {/* Scanner Overlay Line */}
          {isScanning && (
            <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-[2px]">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute shadow-glow-cyan animate-scan" />
              <div className="absolute inset-0 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold bg-navy-950/60">
                <Scan className="w-6 h-6 animate-spin text-cyan-400 mr-2" />
                <span>Running Computer Vision Detection Model v4.2...</span>
              </div>
            </div>
          )}

          {/* AI Bounding Box & Diagnostic Overlay */}
          {!isScanning && scanResult && (
            <div 
              className="absolute border-2 border-cyan-400 bg-cyan-500/10 rounded-lg shadow-glow-cyan transition-all duration-500 animate-pulse"
              style={{
                top: `${selectedPreset.bbox.top}%`,
                left: `${selectedPreset.bbox.left}%`,
                width: `${selectedPreset.bbox.width}%`,
                height: `${selectedPreset.bbox.height}%`,
              }}
            >
              {/* Corner Targets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

              {/* Tag Label */}
              <div className="absolute -top-7 left-0 bg-navy-950/95 border border-cyan-400/80 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md flex items-center space-x-1 whitespace-nowrap">
                <span>🎯 {scanResult.category}</span>
                <span className="text-white font-extrabold">({scanResult.confidence}%)</span>
              </div>
            </div>
          )}

          {/* Custom Upload Overlay Button */}
          <label className="absolute bottom-3 right-3 bg-navy-900/90 hover:bg-navy-800 text-white border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center space-x-1.5 shadow-lg transition">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Photo/Video</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Right AI Diagnostics & Submission Form */}
        <div className="space-y-4">
          
          {!scanResult ? (
            <div className="text-center py-8 space-y-3">
              <Camera className="w-12 h-12 text-cyan-400 mx-auto opacity-80 animate-bounce" />
              <p className="text-slate-300 text-sm font-medium">Ready to scan infrastructure photo</p>
              <button
                onClick={() => handleRunScan()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold px-6 py-2.5 rounded-xl text-xs tracking-wider uppercase shadow-glow-cyan transition transform hover:scale-105"
              >
                Launch AI Vision Scanner
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              
              {/* Detected Issue & Confidence Card */}
              <div className="bg-navy-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase">AI Defect Classification</span>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    ✓ Confidence: {scanResult.confidence}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-extrabold text-white">{scanResult.category}</h4>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    scanResult.severityLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    scanResult.severityLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    Severity Score: {scanResult.severityScore}/100 ({scanResult.severityLevel})
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-navy-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <strong className="text-cyan-400">AI Recommended Action:</strong> {scanResult.recommendedAction}
                </p>
              </div>

              {/* Additional Context Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] font-medium mb-1">Street / Location</label>
                  <input 
                    type="text" 
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-medium focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] font-medium mb-1">Traffic Density</label>
                  <select
                    value={trafficDensity}
                    onChange={(e) => setTrafficDensity(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-medium focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="High">High (Major Thoroughfare)</option>
                    <option value="Medium">Medium (Collector Road)</option>
                    <option value="Low">Low (Residential Alley)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <input 
                  type="checkbox" 
                  id="sens" 
                  checked={isNearSensitiveZone} 
                  onChange={(e) => setIsNearSensitiveZone(e.target.checked)}
                  className="rounded bg-navy-950 border-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="sens" className="text-slate-300 cursor-pointer">
                  Near Sensitive Infrastructure (School, Hospital, Metro station)
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReport}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-glow-cyan transition flex items-center justify-center space-x-2"
              >
                <span>Submit AI Verified Complaint (+50 Civic Pts)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
