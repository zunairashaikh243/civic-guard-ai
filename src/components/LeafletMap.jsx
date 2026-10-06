import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { useInfrastructure } from '../context/InfrastructureContext';
import { Filter, Layers, Search, AlertCircle } from 'lucide-react';
import { getMapboxToken } from '../services/infrastructureApi';

const CATEGORY_OPTIONS = ['ALL', 'Pothole', 'Road crack', 'Broken streetlight', 'Overflowing drain', 'Garbage accumulation', 'Damaged traffic sign'];
const SEVERITY_OPTIONS = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const buildClusterGroups = (items) => {
  const groups = [];

  items.forEach((issue) => {
    const nearbyGroup = groups.find((group) => {
      const anchor = group[0];
      if (!anchor) return false;
      return Math.hypot(issue.lat - anchor.lat, issue.lng - anchor.lng) < 0.015;
    });

    if (nearbyGroup) nearbyGroup.push(issue);
    else groups.push([issue]);
  });

  return groups;
};

const getMarkerColor = (severity) => {
  if (severity === 'CRITICAL') return '#ef4444';
  if (severity === 'HIGH') return '#f97316';
  if (severity === 'MEDIUM') return '#f59e0b';
  return '#10b981';
};

export default function LeafletMap({ filterCategory = 'ALL', filterSeverity = 'ALL', onSelectIssue }) {
  const { issues, setSelectedIssue } = useInfrastructure();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState(filterCategory);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState(filterSeverity);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);
  const [showRecurringOnly, setShowRecurringOnly] = useState(false);
  const [showHighRiskOnly, setShowHighRiskOnly] = useState(false);
  const mapboxToken = getMapboxToken();

  const filteredIssues = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return issues.filter((issue) => {
      const normalizedIssue = issue;
      const categoryMatch = activeCategoryFilter === 'ALL' || normalizedIssue.category === activeCategoryFilter;
      const severityMatch = activeSeverityFilter === 'ALL' || normalizedIssue.severityLevel === activeSeverityFilter;
      const unresolvedMatch = !showOnlyUnresolved || normalizedIssue.status !== 'RESOLVED';
      const recurringMatch = !showRecurringOnly || Boolean(normalizedIssue.isRecurring);
      const highRiskMatch = !showHighRiskOnly || Number(normalizedIssue.riskScore || normalizedIssue.severityScore || 0) >= 70;
      const searchMatch = !normalizedSearch || [normalizedIssue.location, normalizedIssue.title, normalizedIssue.category, normalizedIssue.id].join(' ').toLowerCase().includes(normalizedSearch);

      return categoryMatch && severityMatch && unresolvedMatch && recurringMatch && highRiskMatch && searchMatch;
    });
  }, [issues, activeCategoryFilter, activeSeverityFilter, searchTerm, showOnlyUnresolved, showRecurringOnly, showHighRiskOnly]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [40.715, -74.004],
      zoom: 13,
      zoomControl: false
    });

    const tileSource = mapboxToken
      ? `https://api.maptiler.com/maps/datav2-dark/{z}/{x}/{y}.png?key=${mapboxToken}`
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileSource, {
      attribution: mapboxToken ? '&copy; MapTiler &copy; OpenStreetMap contributors' : '&copy; CARTO &copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapboxToken]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const clusterGroups = buildClusterGroups(filteredIssues);

    clusterGroups.forEach((group) => {
      const markerIssue = group[0];
      const clusterCount = group.length;
      const severity = markerIssue.severityLevel || 'MEDIUM';
      const color = getMarkerColor(severity);
      const iconHtml = clusterCount > 1
        ? `<div style="background:${color};border:2px solid rgba(255,255,255,0.7);box-shadow: 0 0 18px ${color};" class="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-black text-white">${clusterCount}</div>`
        : `<div style="background:${color};border:2px solid rgba(255,255,255,0.7);box-shadow: 0 0 18px ${color};" class="flex items-center justify-center w-6 h-6 rounded-full text-[9px] font-black text-white">${markerIssue.severityScore}</div>`;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: iconHtml,
        iconSize: clusterCount > 1 ? [28, 28] : [24, 24],
        iconAnchor: clusterCount > 1 ? [14, 14] : [12, 12]
      });

      const marker = L.marker([markerIssue.lat, markerIssue.lng], { icon: customIcon }).addTo(map);

      const popupContent = group.length > 1
        ? `
          <div class="p-2 max-w-xs text-xs font-sans text-slate-200">
            <div class="font-bold text-cyan-300 text-sm mb-1">${group.length} related infrastructure alerts</div>
            ${group.map((issue) => `
              <div class="border border-slate-700 rounded-lg p-2 mb-1 bg-slate-900/70">
                <div class="flex justify-between gap-2 mb-1">
                  <span class="font-bold text-white text-xs">${issue.category}</span>
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold text-red-200 bg-red-500/20">${issue.severityLevel}</span>
                </div>
                <div class="text-[10px] text-slate-300">${issue.location}</div>
                <button data-issue-id="${issue.id}" class="mt-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold px-2 py-1 rounded text-[10px]">View Details</button>
              </div>
            `).join('')}
          </div>
        `
        : `
          <div class="p-2 max-w-xs text-xs font-sans text-slate-200">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="font-bold text-cyan-400 text-sm">${markerIssue.category}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${
                markerIssue.severityLevel === 'CRITICAL' ? 'bg-red-500/30 text-red-200' :
                markerIssue.severityLevel === 'HIGH' ? 'bg-orange-500/30 text-orange-200' :
                markerIssue.severityLevel === 'MEDIUM' ? 'bg-amber-500/30 text-amber-200' : 'bg-emerald-500/30 text-emerald-200'
              }">${markerIssue.severityLevel} (${markerIssue.severityScore}/100)</span>
            </div>
            <p class="font-medium text-white mb-1.5">${markerIssue.title}</p>
            <div class="text-[10px] text-slate-300 space-y-0.5 mb-2 font-mono">
              <div>📍 ${markerIssue.location}</div>
              <div>👥 ${markerIssue.citizenConfirmations || markerIssue.confirmations || 0} Citizen Confirmations</div>
              <div>⚡ Early Risk: ${markerIssue.riskLevel || 'MEDIUM'} (${markerIssue.riskScore || markerIssue.severityScore || 0})</div>
            </div>
            <div class="flex items-center justify-between border-t border-slate-700/70 pt-2">
              <span class="text-[10px] text-cyan-300 font-bold">Status: ${markerIssue.status}</span>
              <button data-issue-id="${markerIssue.id}" class="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold px-2 py-1 rounded text-[10px]">View Details</button>
            </div>
          </div>
        `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const buttons = Array.from(document.querySelectorAll('[data-issue-id]'));
        buttons.forEach((button) => {
          button.addEventListener('click', () => {
            const selected = issues.find((issue) => issue.id === button.dataset.issueId);
            if (selected) {
              setSelectedIssue(selected);
              if (onSelectIssue) onSelectIssue(selected);
            }
          });
        });
      });

      markersRef.current.push(marker);
    });
  }, [filteredIssues, issues, setSelectedIssue, onSelectIssue]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl glass-panel">
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap gap-2 w-[calc(100%-2rem)]">
        <div className="bg-navy-950/90 backdrop-blur-md border border-slate-700 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs basis-full md:basis-auto">
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search issue, location, or ID"
            className="bg-transparent text-white placeholder:text-slate-400 text-xs focus:outline-none min-w-[120px]"
          />
        </div>

        <div className="bg-navy-950/90 backdrop-blur-md border border-slate-700 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <select value={activeCategoryFilter} onChange={(event) => setActiveCategoryFilter(event.target.value)} className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer">
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option} className="text-slate-900">{option === 'ALL' ? 'All Categories' : option}</option>
            ))}
          </select>
        </div>

        <div className="bg-navy-950/90 backdrop-blur-md border border-slate-700 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <select value={activeSeverityFilter} onChange={(event) => setActiveSeverityFilter(event.target.value)} className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer">
            {SEVERITY_OPTIONS.map((option) => (
              <option key={option} value={option} className="text-slate-900">{option === 'ALL' ? 'All severities' : option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="absolute top-20 left-4 z-[400] flex flex-wrap gap-2">
        <button type="button" onClick={() => setShowOnlyUnresolved((value) => !value)} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${showOnlyUnresolved ? 'bg-cyan-500 text-navy-950' : 'bg-navy-900 text-slate-200 border border-slate-700'}`}>
          Show only unresolved
        </button>
        <button type="button" onClick={() => setShowRecurringOnly((value) => !value)} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${showRecurringOnly ? 'bg-cyan-500 text-navy-950' : 'bg-navy-900 text-slate-200 border border-slate-700'}`}>
          Show recurring issues
        </button>
        <button type="button" onClick={() => setShowHighRiskOnly((value) => !value)} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${showHighRiskOnly ? 'bg-cyan-500 text-navy-950' : 'bg-navy-900 text-slate-200 border border-slate-700'}`}>
          Show high-risk issues
        </button>
      </div>

      {!mapboxToken && (
        <div className="absolute top-36 left-4 z-[400] flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-950/70 text-amber-100 px-3 py-2 text-[10px] font-medium">
          <AlertCircle className="w-4 h-4" />
          Mapbox token missing: using demo map until VITE_MAPBOX_TOKEN is configured.
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-[400] bg-navy-950/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[10px] space-y-1 font-mono text-slate-300 hidden sm:block">
        <div className="font-bold text-slate-200 text-[11px] mb-1">Live Node Status:</div>
        <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" /> <span>Critical Hazard</span></div>
        <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> <span>High Severity</span></div>
        <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> <span>Medium Risk</span></div>
        <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> <span>Resolved</span></div>
      </div>

      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
