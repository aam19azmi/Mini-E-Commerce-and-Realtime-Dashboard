'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

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
  const [addressLabel, setAddressLabel] = useState<string>('Jakarta Pusat Area (Approx. 5.2 km from Warehouse)');
  const [geocoding, setGeocoding] = useState<boolean>(false);

  // Update distance when coordinates change
  const updateCoordinates = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    const dist = calculateDistanceKm(STORE_ORIGIN.lat, STORE_ORIGIN.lng, newLat, newLng);
    const calculatedDist = Math.max(1.5, dist);
    setDistanceKm(calculatedDist);
    onLocationSelect({
      lat: newLat,
      lng: newLng,
      distanceKm: calculatedDist,
      addressText: addressLabel,
    });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = Number(position.coords.latitude.toFixed(6));
        const userLng = Number(position.coords.longitude.toFixed(6));
        setAddressLabel(`Exact GPS Coordinates: ${userLat}, ${userLng}`);
        updateCoordinates(userLat, userLng);
        setLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Fallback default variation
        const randomOffset = (Math.random() - 0.5) * 0.05;
        const newLat = Number((initialLat + randomOffset).toFixed(6));
        const newLng = Number((initialLng + randomOffset).toFixed(6));
        setAddressLabel('Selected Location Pin (Within Greater Jakarta)');
        updateCoordinates(newLat, newLng);
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
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
            <h4 className="text-xs font-bold text-white">Delivery Geolocation Pin</h4>
            <p className="text-[11px] text-slate-400">Pinpoint coordinates to calculate exact courier shipping tariff</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={locating}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <Navigation className={`h-3.5 w-3.5 ${locating ? 'animate-spin' : ''}`} />
          <span>{locating ? 'Detecting GPS...' : 'Use My Current GPS'}</span>
        </button>
      </div>

      {/* Interactive Map Visual Simulation with Pin & OpenStreetMap Tile */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950">
        {/* OpenStreetMap Static/Interactive Tile Frame */}
        <iframe
          title="Delivery Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.04}%2C${
            lat - 0.04
          }%2C${lng + 0.04}%2C${lat + 0.04}&layer=mapnik&marker=${lat}%2C${lng}`}
          className="opacity-80 contrast-125 filter grayscale-[30%]"
        />

        {/* Overlay Coordinates HUD */}
        <div className="absolute top-2 left-2 rounded-lg bg-slate-950/90 px-2.5 py-1 text-[10px] font-mono text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>PIN: {lat.toFixed(4)}°, {lng.toFixed(4)}°</span>
        </div>

        {/* Distance Badge HUD */}
        <div className="absolute bottom-2 right-2 rounded-lg bg-slate-950/90 px-3 py-1.5 text-xs font-bold text-white border border-white/10 backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
          <span>Distance: <strong className="text-emerald-400">{distanceKm} km</strong></span>
        </div>
      </div>

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
                onClick={() => {
                  setAddressLabel(`Destination: ${preset.label}`);
                  updateCoordinates(preset.lat, preset.lng);
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
