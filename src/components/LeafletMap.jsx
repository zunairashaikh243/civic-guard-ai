import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useInfrastructure } from '../context/InfrastructureContext';
import { Filter, Layers, AlertCircle, Eye, ThumbsUp, CheckCircle } from 'lucide-react';

export default function LeafletMap({ filterCategory = "ALL", filterSeverity = "ALL", onSelectIssue }) {
  const { issues, setSelectedIssue, confirmExistingIssue } = useInfrastructure();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState(filterCategory);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState(filterSeverity);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    // Default center on Metro City
    const map = L.map(mapContainerRef.current, {
      center: [40.7150, -74.0040],
      zoom: 13,
      zoomControl: false
    });

    // Add Dark Mode CartoDB Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Zoom control position
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when issues or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Filter issues
    const filtered = issues.filter(issue => {
      if (activeCategoryFilter !== "ALL" && issue.category !== activeCategoryFilter) return false;
      if (activeSeverityFilter !== "ALL" && issue.severityLevel !== activeSeverityFilter) return false;
      return true;
    });

    filtered.forEach(issue => {
      // Determine glowing pin color by severity
      let pinClass = "custom-marker-low";
      if (issue.severityLevel === "CRITICAL") pinClass = "custom-marker-critical";
      else if (issue.severityLevel === "HIGH") pinClass = "custom-marker-high";
      else if (issue.severityLevel === "MEDIUM") pinClass = "custom-marker-medium";
      if (issue.status === "RESOLVED") pinClass = "custom-marker-low";

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div class="w-6 h-6 ${pinClass} flex items-center justify-center text-white font-extrabold text-[10px] shadow-lg animate-pulse">
                ${issue.severityScore}
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([issue.lat, issue.lng], { icon: customIcon }).addTo(map);

      // Popup content HTML
      const popupHtml = `
        <div class="p-2 max-w-xs text-xs font-sans">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="font-bold text-cyan-400 text-sm">${issue.category}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${
              issue.severityLevel === 'CRITICAL' ? 'bg-red-500/30 text-red-400 border border-red-500/50' :
              issue.severityLevel === 'HIGH' ? 'bg-orange-500/30 text-orange-400 border border-orange-500/50' :
              'bg-amber-500/30 text-amber-400 border border-amber-500/50'
            }">${issue.severityLevel} (${issue.severityScore}/100)</span>
          </div>
          <p class="text-slate-300 font-medium mb-1.5">${issue.title}</p>
          <div class="text-[10px] text-slate-400 space-y-0.5 mb-2 font-mono">
            <div>📍 ${issue.location}</div>
            <div>👥 ${issue.confirmations} Citizen Confirmations</div>
            <div>⚡ Action: ${issue.recommendedAction}</div>
          </div>
          <div class="flex items-center justify-between border-t border-slate-700/60 pt-2">
            <span class="text-[10px] text-cyan-300 font-bold">Status: ${issue.status}</span>
            <button id="btn-select-${issue.id}" class="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold px-2 py-1 rounded text-[10px] transition">
              Inspect AI Diagnostics →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${issue.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            setSelectedIssue(issue);
            if (onSelectIssue) onSelectIssue(issue);
          });
        }
      });

      markersRef.current.push(marker);
    });

  }, [issues, activeCategoryFilter, activeSeverityFilter, setSelectedIssue, onSelectIssue]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl glass-panel">
      
      {/* Map Control Bar Overlay */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap gap-2">
        
        {/* Category Selector */}
        <div className="bg-navy-950/90 backdrop-blur-md border border-slate-700 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Category:</span>
          <select 
            value={activeCategoryFilter}
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Pothole">Potholes</option>
            <option value="Road crack">Road Cracks</option>
            <option value="Broken streetlight">Streetlights</option>
            <option value="Overflowing drain">Drains</option>
            <option value="Garbage accumulation">Garbage</option>
            <option value="Damaged traffic sign">Traffic Signs</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div className="bg-navy-950/90 backdrop-blur-md border border-slate-700 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Priority:</span>
          <select 
            value={activeSeverityFilter}
            onChange={(e) => setActiveSeverityFilter(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">🔴 Critical Only (85+)</option>
            <option value="HIGH">🟠 High Only (65+)</option>
            <option value="MEDIUM">🟡 Medium Only</option>
          </select>
        </div>

      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-navy-950/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[10px] space-y-1 font-mono text-slate-300 hidden sm:block">
        <div className="font-bold text-slate-200 text-[11px] mb-1">Live Node Status:</div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-glow-red" />
          <span>Critical Hazard (85–100)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span>High Severity (65–84)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Medium Risk (40–64)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Resolved / Healthy Node</span>
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
