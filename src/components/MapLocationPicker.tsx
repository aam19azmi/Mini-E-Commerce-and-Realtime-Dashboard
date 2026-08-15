'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, AlertCircle, Search, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Store Origin: NovaStore Central Hub, Jakarta
const STORE_ORIGIN = {
  lat: -6.2088,
  lng: 106.8456,
  name: 'NovaStore Central Hub (Jakarta)',
};

interface MapLocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    distanceKm: number;
    addressText?: string;
  }) => void;
  initialLat?: number;
  initialLng?: number;
}

// Haversine distance formula in KM
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function MapLocationPicker({
  onLocationSelect,
  initialLat = -6.2088,
  initialLng = 106.8456,
}: MapLocationPickerProps) {
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [distanceKm, setDistanceKm] = useState<number>(5.2);
  const [locating, setLocating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addressLabel, setAddressLabel] = useState<string>('Jakarta Pusat Area (Approx. 5.2 km from Central Hub)');
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Reverse geocode to get actual city / address name
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await res.json();
      if (data && data.display_name) {
        setAddressLabel(data.display_name);
        return data.display_name;
      }
    } catch (e) {
      console.warn('Reverse geocode error:', e);
    }
    return `Pin: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
  };

  // Update distance when coordinates change
  const updateCoordinates = async (newLat: number, newLng: number, explicitAddress?: string) => {
    setLat(newLat);
    setLng(newLng);
    const dist = calculateDistanceKm(STORE_ORIGIN.lat, STORE_ORIGIN.lng, newLat, newLng);
    const calculatedDist = Math.max(1.5, dist);
    setDistanceKm(calculatedDist);

    let address = explicitAddress;
    if (!address) {
      address = await reverseGeocode(newLat, newLng);
    } else {
      setAddressLabel(address);
    }

    onLocationSelect({
      lat: newLat,
      lng: newLng,
      distanceKm: calculatedDist,
      addressText: address,
    });
  };

  // Initialize Interactive Leaflet Map on Client Side
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;

      // Fix default Leaflet icon paths
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current).setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([lat, lng], {
          draggable: true,
          icon: customIcon,
        }).addTo(map);

        marker.bindPopup('<b>Your Delivery Destination</b><br>Click anywhere or drag this pin!').openPopup();

        // 1. Drag pin event
        marker.on('dragend', async (e: any) => {
          const position = e.target.getLatLng();
          await updateCoordinates(position.lat, position.lng);
        });

        // 2. Click anywhere on the map to move pin
        map.on('click', async (e: any) => {
          const { lat: clickedLat, lng: clickedLng } = e.latlng;
          marker.setLatLng([clickedLat, clickedLng]);
          map.panTo([clickedLat, clickedLng]);
          await updateCoordinates(clickedLat, clickedLng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center and marker when lat/lng changes externally
  const moveMapTo = (newLat: number, newLng: number, zoomLevel = 14) => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([newLat, newLng]);
      mapInstanceRef.current.flyTo([newLat, newLng], zoomLevel, { duration: 1.2 });
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = Number(position.coords.latitude.toFixed(6));
        const userLng = Number(position.coords.longitude.toFixed(6));
        moveMapTo(userLat, userLng, 15);
        await updateCoordinates(userLat, userLng);
        setLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLocating(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const searchLat = parseFloat(data[0].lat);
        const searchLng = parseFloat(data[0].lon);
        moveMapTo(searchLat, searchLng, 14);
        await updateCoordinates(searchLat, searchLng, data[0].display_name);
      } else {
        alert('Location not found. Please try another search term or click directly on the map.');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    } finally {
      setLocating(false);
    }
  };

  // Preset location quick selectors (Popular regions in Indonesia)
  const PRESET_DESTINATIONS = [
    { label: 'Jakarta Pusat', lat: -6.1754, lng: 106.8272 },
    { label: 'Bandung', lat: -6.9175, lng: 107.6191 },
    { label: 'Surabaya', lat: -7.2575, lng: 112.7521 },
    { label: 'Denpasar Bali', lat: -8.6705, lng: 115.2126 },
    { label: 'Medan', lat: 3.5952, lng: 98.6722 },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-4 sm:p-5 backdrop-blur-xl shadow-lg space-y-4">
      {/* Header & Locate Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Interactive Delivery Pin &amp; Map</h4>
            <p className="text-[11px] text-slate-400">Click anywhere on the map or drag the pin to set your exact location</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={locating}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
          <span>{locating ? 'Detecting GPS...' : 'Use My Current GPS'}</span>
        </button>
      </div>

      {/* Search Address Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search province, city, district, or street (e.g. Dago Bandung, Menteng Jakarta)..."
              className="w-full rounded-xl border border-white/10 bg-slate-800/90 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={locating}
            className="rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-cyan-400 hover:bg-slate-700 border border-white/10"
          >
            Search
          </button>
        </div>
        <span className="text-[10px] text-slate-400 mt-1 block">
          💡 Click anywhere on the map below or search above to move your delivery pin.
        </span>
      </form>

      {/* Real Interactive Leaflet Map Container */}
      <div className="relative h-56 w-full overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950 shadow-inner">
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        {/* Overlay Coordinates HUD */}
        <div className="absolute top-2 left-2 z-10 rounded-lg bg-slate-950/90 px-2.5 py-1 text-[10px] font-mono text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-lg flex items-center gap-1.5 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>PIN: {lat.toFixed(4)}°, {lng.toFixed(4)}°</span>
        </div>

        {/* Distance Badge HUD */}
        <div className="absolute bottom-2 right-2 z-10 rounded-lg bg-slate-950/90 px-3 py-1.5 text-xs font-bold text-white border border-white/10 backdrop-blur-md shadow-lg flex items-center gap-1.5 pointer-events-none">
          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
          <span>Distance: <strong className="text-emerald-400">{distanceKm} km</strong></span>
        </div>
      </div>

      {/* Selected Address Display */}
      {addressLabel && (
        <div className="rounded-xl border border-white/5 bg-slate-950/60 p-2.5 text-xs text-slate-300 flex items-start gap-2">
          <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-semibold text-white block">Selected Address:</span>
            <span className="text-slate-400">{addressLabel}</span>
          </div>
        </div>
      )}

      {/* Quick Region Selector Pills */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Quick City Presets:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_DESTINATIONS.map((preset) => {
            const isSelected = Math.abs(preset.lat - lat) < 0.01 && Math.abs(preset.lng - lng) < 0.01;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={async () => {
                  moveMapTo(preset.lat, preset.lng, 13);
                  await updateCoordinates(preset.lat, preset.lng, `City of ${preset.label}`);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'border-white/5 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
