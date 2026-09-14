'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Map as LeafletMap, GeoJSON as LeafletGeoJSON, LayerGroup } from 'leaflet';
import {
  Search, Info, RotateCcw, Download, ChevronDown, ChevronUp,
  Accessibility, X,
} from 'lucide-react';

// ─── Data layer definitions ────────────────────────────────────────────────
type LayerKey = 'malnutrition' | 'wasting' | 'stunting' | 'wash' | 'poverty';

interface LayerConfig {
  key: LayerKey;
  label: string;
  description: string;
  colorFn: (v: number) => string;
  field: string;
  unit: string;
  icon: string;
  legendStops: { label: string; color: string }[];
}

// Colorblind-friendly palette (tested with Coblis — deuteranopia/protanopia safe)
// Uses a diverging blue-to-red scale that remains distinguishable
const LAYERS: LayerConfig[] = [
  {
    key: 'malnutrition',
    label: 'Predicted Cases',
    description: 'ML-predicted acute malnutrition cases per county',
    field: 'predicted_cases',
    unit: 'cases',
    icon: '🧮',
    colorFn: (v: number) => {
      if (v > 5000) return '#7f3a08';
      if (v > 2000) return '#d9531e';
      if (v > 1000) return '#f0a04b';
      if (v > 500) return '#f7d488';
      if (v > 100) return '#a8d8a8';
      return '#4a9d6c';
    },
    legendStops: [
      { label: '<100', color: '#4a9d6c' },
      { label: '100–500', color: '#a8d8a8' },
      { label: '500–1K', color: '#f7d488' },
      { label: '1K–2K', color: '#f0a04b' },
      { label: '2K–5K', color: '#d9531e' },
      { label: '>5K', color: '#7f3a08' },
    ],
  },
  {
    key: 'stunting',
    label: 'Stunting Rate',
    description: '% of under-5s who are stunted (height-for-age < -2 SD)',
    field: 'stunting',
    unit: '%',
    icon: '📏',
    colorFn: (v: number) => {
      if (v > 30) return '#5e2c04';
      if (v > 25) return '#b45309';
      if (v > 20) return '#d97706';
      if (v > 15) return '#fbbf24';
      if (v > 10) return '#a8d8a8';
      return '#4a9d6c';
    },
    legendStops: [
      { label: '<10%', color: '#4a9d6c' },
      { label: '10–15%', color: '#a8d8a8' },
      { label: '15–20%', color: '#fbbf24' },
      { label: '20–25%', color: '#d97706' },
      { label: '25–30%', color: '#b45309' },
      { label: '>30%', color: '#5e2c04' },
    ],
  },
  {
    key: 'wasting',
    label: 'Wasting Rate',
    description: '% of under-5s who are wasted (weight-for-height < -2 SD)',
    field: 'wasting',
    unit: '%',
    icon: '⚖️',
    colorFn: (v: number) => {
      if (v > 7) return '#7f3a08';
      if (v > 5) return '#d9531e';
      if (v > 3) return '#f0a04b';
      if (v > 2) return '#f7d488';
      return '#4a9d6c';
    },
    legendStops: [
      { label: '<2%', color: '#4a9d6c' },
      { label: '2–3%', color: '#f7d488' },
      { label: '3–5%', color: '#f0a04b' },
      { label: '5–7%', color: '#d9531e' },
      { label: '>7%', color: '#7f3a08' },
    ],
  },
  {
    key: 'wash',
    label: 'Water Access',
    description: '% of households with access to improved water sources',
    field: 'water_access',
    unit: '%',
    icon: '💧',
    colorFn: (v: number) => {
      // Inverted: higher is better (green), lower is worse (red)
      if (v > 80) return '#4a9d6c';
      if (v > 60) return '#a8d8a8';
      if (v > 45) return '#f7d488';
      if (v > 30) return '#f0a04b';
      return '#d9531e';
    },
    legendStops: [
      { label: '<30%', color: '#d9531e' },
      { label: '30–45%', color: '#f0a04b' },
      { label: '45–60%', color: '#f7d488' },
      { label: '60–80%', color: '#a8d8a8' },
      { label: '>80%', color: '#4a9d6c' },
    ],
  },
  {
    key: 'poverty',
    label: 'Poverty Rate',
    description: '% of population below the poverty line',
    field: 'poverty',
    unit: '%',
    icon: '💰',
    colorFn: (v: number) => {
      if (v > 60) return '#5e2c04';
      if (v > 45) return '#b45309';
      if (v > 35) return '#d97706';
      if (v > 25) return '#fbbf24';
      return '#4a9d6c';
    },
    legendStops: [
      { label: '<25%', color: '#4a9d6c' },
      { label: '25–35%', color: '#fbbf24' },
      { label: '35–45%', color: '#d97706' },
      { label: '45–60%', color: '#b45309' },
      { label: '>60%', color: '#5e2c04' },
    ],
  },
];

interface CountyData {
  stunting: number;
  wasting: number;
  underweight: number;
  water_access: number;
  sanitation: number;
  poverty: number;
  gam_risk: string;
  population_under_5: number;
  predicted_cases: number;
  centroid_lon: number;
  centroid_lat: number;
}

interface KenyaGISMapProps {
  selectedCounty: string;
  onSelect: (county: string) => void;
  activeLayer: LayerKey;
  onLayerChange: (layer: LayerKey) => void;
  countyData: Record<string, CountyData>;
  geojson: any;
  lastUpdated: string;
}

export default function KenyaGISMap({
  selectedCounty, onSelect, activeLayer, onLayerChange,
  countyData, geojson, lastUpdated,
}: KenyaGISMapProps) {
  const [showLabels, setShowLabels] = useState(true);
  const [liveMode, setLiveMode] = useState(false);
  const [liveTimestamp, setLiveTimestamp] = useState<string | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [colorblindMode, setColorblindMode] = useState(false);
  const [legendOpen, setLegendOpen] = useState(true);
  const [showLiveInfo, setShowLiveInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);
  const labelsRef = useRef<LayerGroup | null>(null);

  // ─── Search logic ──────────────────────────────────────────────────────
  const allCounties = Object.keys(countyData).sort();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    setSearchResults(
      allCounties.filter((c) => c.toLowerCase().includes(q)).slice(0, 8),
    );
  }, [searchQuery, allCounties]);

  const handleSearchSelect = (county: string) => {
    onSelect(county);
    setSearchQuery(county);
    setSearchResults([]);
    setSearchFocused(false);
    // Fly to the selected county on the map
    const data = countyData[county];
    if (data && mapRef.current) {
      mapRef.current.flyTo([data.centroid_lat, data.centroid_lon], 8, { duration: 1.2 });
    }
  };

  // ─── Reset view ─────────────────────────────────────────────────────────
  const resetView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([0.5, 37.9], 6, { duration: 1.0 });
    }
  }, []);

  // ─── Live data fetch ───────────────────────────────────────────────────
  const fetchLiveData = async () => {
    setIsLoadingLive(true);
    try {
      const res = await fetch('/api/predict', { method: 'GET' });
      if (res.ok) {
        setLiveTimestamp(new Date().toISOString());
      }
    } catch (e) {
      console.error('Live fetch failed:', e);
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    if (!liveMode) return;
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30_000);
    return () => clearInterval(interval);
  }, [liveMode]);

  // ─── Initialize Leaflet map ────────────────────────────────────────────
  useEffect(() => {
    if (!geojson || mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (!document.querySelector('link[data-leaflet]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.setAttribute('data-leaflet', 'true');
        document.head.appendChild(link);
      }
      if (cancelled || mapRef.current) return;

      const map = L.map('leaflet-map', {
        center: [0.5, 37.9],
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 10,
      }).addTo(map);

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        geoJsonRef.current = null;
        labelsRef.current = null;
      }
    };
  }, [geojson]);

  // ─── Draw / redraw GeoJSON layer ───────────────────────────────────────
  useEffect(() => {
    if (!geojson || !mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapRef.current) return;

      if (geoJsonRef.current) { geoJsonRef.current.remove(); geoJsonRef.current = null; }
      if (labelsRef.current) { labelsRef.current.remove(); labelsRef.current = null; }

      const layerConfig = LAYERS.find((l) => l.key === activeLayer)!;
      const useCB = colorblindMode;

      const cbColorFn = (v: number) => {
        // Colorblind-friendly: use a blue-to-orange diverging scale
        const ranges: Record<LayerKey, [number, string][]> = {
          malnutrition: [[5000, '#08519c'], [2000, '#3182bd'], [1000, '#6baed6'], [500, '#c6dbef'], [100, '#fd8d3c'], [0, '#74c476']],
          stunting: [[30, '#08519c'], [25, '#3182bd'], [20, '#6baed6'], [15, '#c6dbef'], [10, '#fd8d3c'], [0, '#74c476']],
          wasting: [[7, '#08519c'], [5, '#3182bd'], [3, '#6baed6'], [2, '#c6dbef'], [0, '#74c476']],
          wash: [[80, '#74c476'], [60, '#c6dbef'], [45, '#6baed6'], [30, '#3182bd'], [0, '#08519c']],
          poverty: [[60, '#08519c'], [45, '#3182bd'], [35, '#6baed6'], [25, '#c6dbef'], [0, '#74c476']],
        };
        const stops = ranges[activeLayer];
        for (const [threshold, color] of stops) {
          if (activeLayer === 'wash' ? v <= threshold : v >= threshold) return color;
        }
        return '#74c476';
      };

      const activeColorFn = useCB ? cbColorFn : layerConfig.colorFn;

      const styleFor = (feature: any) => {
        const name = feature.properties?.name;
        const data = countyData[name];
        const value = data ? (data as any)[layerConfig.field] : 0;
        const isSelected = name === selectedCounty;
        return {
          fillColor: data ? activeColorFn(value) : '#cbd5e1',
          weight: isSelected ? 3 : 1,
          opacity: 1,
          color: isSelected ? '#059669' : '#ffffff',
          dashArray: isSelected ? '4 3' : undefined,
          fillOpacity: isSelected ? 0.85 : 0.65,
        };
      };

      const onEachFeature = (feature: any, layer: L.Layer) => {
        const name = feature.properties?.name || 'Unknown';
        const data = countyData[name];
        const value = data ? (data as any)[layerConfig.field] : '—';
        const unit = layerConfig.unit;
        const html = `
          <div style="font-family: Inter, sans-serif; min-width: 180px;">
            <strong style="font-size: 14px; color: #0f172a;">${name}</strong><br/>
            <span style="color: #475569; font-size: 12px;">${layerConfig.icon} ${layerConfig.label}: <strong>${value}${unit === '%' ? '%' : ''}</strong>${unit !== '%' ? ' ' + unit : ''}</span><br/>
            ${data ? `<span style="color: #94a3b8; font-size: 11px;">Predicted cases: ${data.predicted_cases.toLocaleString()} · Stunting: ${data.stunting}%</span><br/>` : ''}
            <span style="color: #059669; font-size: 11px;">Click to explore →</span>
          </div>
        `;
        layer.bindTooltip(html, { sticky: true, className: 'kenya-tooltip' });
        layer.on('click', () => onSelect(name));
      };

      geoJsonRef.current = L.geoJSON(geojson, { style: styleFor, onEachFeature }).addTo(mapRef.current);

      if (showLabels) {
        labelsRef.current = L.layerGroup().addTo(mapRef.current);
        for (const feat of geojson.features) {
          const name = feat.properties?.name;
          const data = countyData[name];
          if (!data) continue;
          const value = (data as any)[layerConfig.field];
          L.marker([data.centroid_lat, data.centroid_lon], {
            icon: L.divIcon({
              className: 'county-label',
              html: `<div style="font-size:9px;font-weight:600;color:#0f172a;background:rgba(255,255,255,0.85);padding:1px 4px;border-radius:3px;border:1px solid rgba(0,0,0,0.1);white-space:nowrap;">${name}<br/><span style="color:#475569;font-weight:400;">${value}${layerConfig.unit === '%' ? '%' : ''}</span></div>`,
              iconSize: [80, 24],
              iconAnchor: [40, 12],
            }),
          }).addTo(labelsRef.current);
        }
      }

      if (geoJsonRef.current && (geoJsonRef.current as any).getBounds) {
        try { mapRef.current.fitBounds((geoJsonRef.current as any).getBounds()); } catch { /* */ }
      }
    })();

    return () => { cancelled = true; };
  }, [geojson, countyData, activeLayer, selectedCounty, showLabels, colorblindMode]);

  // ─── Export functions ──────────────────────────────────────────────────
  const exportCSV = () => {
    const rows = [['County', 'Predicted_Cases', 'Stunting_%', 'Wasting_%', 'Underweight_%', 'Water_Access_%', 'Poverty_%', 'GAM_Risk', 'Under5_Population']];
    for (const [name, d] of Object.entries(countyData)) {
      rows.push([name, String(d.predicted_cases), String(d.stunting), String(d.wasting), String(d.underweight), String(d.water_access), String(d.poverty), d.gam_risk, String(d.population_under_5)]);
    }
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kenya-malnutrition-county-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportGeoJSON = () => {
    if (!geojson) return;
    const enriched = {
      ...geojson,
      features: geojson.features.map((f: any) => ({
        ...f,
        properties: {
          ...f.properties,
          ...(countyData[f.properties?.name] || {}),
        },
      })),
    };
    const blob = new Blob([JSON.stringify(enriched, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kenya-counties-malnutrition.geojson';
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeLayerConfig = LAYERS.find((l) => l.key === activeLayer)!;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ─── Header + controls ─── */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <h2 className="text-lg font-bold text-slate-900">Kenya Malnutrition GIS Map</h2>
          {/* Data freshness badge */}
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Last updated: {lastUpdated}
            </span>
          </div>
        </div>

        {/* Search bar + Live mode + Labels + Colorblind + Reset + Export */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search county…"
              aria-label="Search for a Kenya county"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Clear search">
                <X className="w-4 h-4" />
              </button>
            )}
            {/* Search results dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <ul className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((county) => (
                  <li key={county}>
                    <button
                      onClick={() => handleSearchSelect(county)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 focus:outline-none focus:bg-emerald-50"
                    >
                      <span className="font-medium">{county}</span>
                      <span className="text-slate-400 ml-2 text-xs">
                        {countyData[county]?.predicted_cases.toLocaleString() || '—'} cases
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Live mode with info tooltip */}
          <div className="relative">
            <div className="flex items-center gap-0">
              <button
                onClick={() => setLiveMode(!liveMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-l-lg text-xs font-medium transition-colors ${
                  liveMode ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                }`}
                aria-pressed={liveMode}
              >
                <span className={`w-2 h-2 rounded-full ${liveMode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} aria-hidden="true" />
                {isLoadingLive ? 'Refreshing…' : liveMode ? 'Live' : 'Live mode'}
              </button>
              <button
                onClick={() => setShowLiveInfo(!showLiveInfo)}
                className="px-2 py-2 rounded-r-lg bg-slate-100 text-slate-500 border border-l-0 border-slate-300 hover:bg-slate-200"
                aria-label="What does Live mode mean?"
              >
                <Info className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            {showLiveInfo && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-xs text-slate-600 z-30">
                <strong className="text-slate-900">Live Mode</strong> refreshes predicted-case data every 30 seconds by querying the ML inference API. In production, this pulls real-time DHIS2 / KHIS facility reports. The map colours update to reflect the latest available numbers.
                <button onClick={() => setShowLiveInfo(false)} className="block mt-2 text-emerald-600 font-medium">Got it</button>
              </div>
            )}
          </div>

          {/* Labels toggle */}
          <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer px-2 py-2">
            <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            Labels
          </label>

          {/* Colorblind toggle */}
          <button
            onClick={() => setColorblindMode(!colorblindMode)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${colorblindMode ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'}`}
            aria-pressed={colorblindMode}
            title="Toggle colorblind-friendly palette"
          >
            <Accessibility className="w-3.5 h-3.5" aria-hidden="true" />
            CB
          </button>

          {/* Reset view */}
          <button
            onClick={resetView}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200 transition-colors"
            title="Reset map to full-country view"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset
          </button>

          {/* Export */}
          <div className="flex items-center gap-1">
            <button onClick={exportCSV} className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200 transition-colors" title="Download county data as CSV">
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              CSV
            </button>
            <button onClick={exportGeoJSON} className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200 transition-colors" title="Download enriched GeoJSON">
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              GeoJSON
            </button>
          </div>
        </div>

        {/* Layer toggles */}
        <div className="flex flex-wrap gap-2">
          {LAYERS.map((layer) => (
            <button
              key={layer.key}
              onClick={() => onLayerChange(layer.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeLayer === layer.key ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={layer.description}
            >
              <span aria-hidden="true">{layer.icon}</span>
              {layer.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">{activeLayerConfig.description}</p>
      </div>

      {/* ─── Map container with overlay legend ─── */}
      <div className="relative">
        <div
          id="leaflet-map"
          className="w-full"
          style={{ height: '520px', background: '#e5e7eb' }}
          role="application"
          aria-label="Interactive map of Kenya showing malnutrition data by county. Use zoom controls to explore topography."
        />

        {/* Collapsible legend overlay on the map */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 max-w-[280px]">
          <button
            onClick={() => setLegendOpen(!legendOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-t-xl"
            aria-expanded={legendOpen}
          >
            <span>{activeLayerConfig.icon} {activeLayerConfig.label} Legend</span>
            {legendOpen ? <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" /> : <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />}
          </button>
          {legendOpen && (
            <div className="px-3 pb-3 flex flex-col gap-1.5">
              {activeLayerConfig.legendStops.map((stop) => (
                <div key={stop.label} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded shrink-0" style={{ background: stop.color }} aria-hidden="true" />
                  <span className="text-xs text-slate-600">{stop.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Bottom hint ─── */}
      <div className="border-t border-slate-200 p-3 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400">
          Click a county to explore · Scroll to zoom · Drag to pan · Search to jump
        </span>
        {liveTimestamp && (
          <span className="text-xs text-emerald-600">
            ● Live data refreshed {new Date(liveTimestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
