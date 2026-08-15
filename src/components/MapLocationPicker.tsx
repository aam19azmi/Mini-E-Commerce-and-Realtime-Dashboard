'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, Search, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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

// Built-in High-Accuracy Indonesia Locations Dictionary
const INDONESIA_LOCATIONS: Record<string, { lat: number; lng: number; name: string }> = {
  // Java & Greater Jakarta
  jakarta: { lat: -6.2088, lng: 106.8456, name: 'DKI Jakarta (Pusat)' },
  'jakarta pusat': { lat: -6.1754, lng: 106.8272, name: 'Jakarta Pusat, DKI Jakarta' },
  'jakarta selatan': { lat: -6.2615, lng: 106.8106, name: 'Jakarta Selatan, DKI Jakarta' },
  'jakarta barat': { lat: -6.1674, lng: 106.7637, name: 'Jakarta Barat, DKI Jakarta' },
  'jakarta timur': { lat: -6.225, lng: 106.9004, name: 'Jakarta Timur, DKI Jakarta' },
  'jakarta utara': { lat: -6.1384, lng: 106.864, name: 'Jakarta Utara, DKI Jakarta' },
  menteng: { lat: -6.1969, lng: 106.8336, name: 'Menteng, Jakarta Pusat' },
  kemang: { lat: -6.2778, lng: 106.8167, name: 'Kemang, Jakarta Selatan' },
  bogor: { lat: -6.5971, lng: 106.806, name: 'Kota Bogor, Jawa Barat' },
  depok: { lat: -6.4025, lng: 106.7942, name: 'Kota Depok, Jawa Barat' },
  tangerang: { lat: -6.1783, lng: 106.6319, name: 'Kota Tangerang, Banten' },
  'tangerang selatan': { lat: -6.2886, lng: 106.7179, name: 'Tangerang Selatan, Banten' },
  bsd: { lat: -6.3015, lng: 106.6522, name: 'BSD City, Tangerang Selatan' },
  bekasi: { lat: -6.2383, lng: 106.9756, name: 'Kota Bekasi, Jawa Barat' },
  cikarang: { lat: -6.3044, lng: 107.1539, name: 'Cikarang, Bekasi, Jawa Barat' },
  bandung: { lat: -6.9175, lng: 107.6191, name: 'Kota Bandung, Jawa Barat' },
  dago: { lat: -6.8778, lng: 107.6158, name: 'Dago, Bandung, Jawa Barat' },
  cimahi: { lat: -6.8723, lng: 107.542, name: 'Cimahi, Jawa Barat' },
  cirebon: { lat: -6.732, lng: 108.5523, name: 'Kota Cirebon, Jawa Barat' },
  semarang: { lat: -6.9667, lng: 110.4167, name: 'Kota Semarang, Jawa Tengah' },
  solo: { lat: -7.5755, lng: 110.8243, name: 'Surakarta (Solo), Jawa Tengah' },
  surakarta: { lat: -7.5755, lng: 110.8243, name: 'Surakarta (Solo), Jawa Tengah' },
  yogyakarta: { lat: -7.7956, lng: 110.3695, name: 'DI Yogyakarta' },
  jogja: { lat: -7.7956, lng: 110.3695, name: 'DI Yogyakarta' },
  sleman: { lat: -7.6896, lng: 110.3444, name: 'Sleman, DI Yogyakarta' },
  surabaya: { lat: -7.2575, lng: 112.7521, name: 'Kota Surabaya, Jawa Timur' },
  malang: { lat: -7.9666, lng: 112.6326, name: 'Kota Malang, Jawa Timur' },
  sidoarjo: { lat: -7.4478, lng: 112.7183, name: 'Sidoarjo, Jawa Timur' },
  gresik: { lat: -7.1566, lng: 112.6555, name: 'Gresik, Jawa Timur' },

  // Bali & Nusa Tenggara
  bali: { lat: -8.6705, lng: 115.2126, name: 'Denpasar, Bali' },
  denpasar: { lat: -8.6705, lng: 115.2126, name: 'Denpasar, Bali' },
  kuta: { lat: -8.7233, lng: 115.1723, name: 'Kuta, Badung, Bali' },
  seminyak: { lat: -8.6894, lng: 115.1586, name: 'Seminyak, Bali' },
  canggu: { lat: -8.6478, lng: 115.1385, name: 'Canggu, Bali' },
  ubud: { lat: -8.5069, lng: 115.2625, name: 'Ubud, Gianyar, Bali' },
  lombok: { lat: -8.5833, lng: 116.1167, name: 'Mataram, Lombok, NTB' },
  mataram: { lat: -8.5833, lng: 116.1167, name: 'Mataram, Lombok, NTB' },
  kupang: { lat: -10.1772, lng: 123.607, name: 'Kupang, NTT' },
  labuanbajo: { lat: -8.4964, lng: 119.8877, name: 'Labuan Bajo, Flores, NTT' },

  // Sumatra
  medan: { lat: 3.5952, lng: 98.6722, name: 'Kota Medan, Sumatera Utara' },
  palembang: { lat: -2.9761, lng: 104.7754, name: 'Kota Palembang, Sumatera Selatan' },
  padang: { lat: -0.9471, lng: 100.4172, name: 'Kota Padang, Sumatera Barat' },
  pekanbaru: { lat: 0.5071, lng: 101.4478, name: 'Pekanbaru, Riau' },
  batam: { lat: 1.1301, lng: 104.0529, name: 'Batam, Kepulauan Riau' },
  lampung: { lat: -5.45, lng: 105.2667, name: 'Bandar Lampung, Lampung' },
  'bandar lampung': { lat: -5.45, lng: 105.2667, name: 'Bandar Lampung, Lampung' },
  jambi: { lat: -1.6101, lng: 103.6131, name: 'Kota Jambi, Jambi' },
  bengkulu: { lat: -3.8004, lng: 102.2655, name: 'Kota Bengkulu, Bengkulu' },
  aceh: { lat: 5.5483, lng: 95.3238, name: 'Banda Aceh, Aceh' },
  'banda aceh': { lat: 5.5483, lng: 95.3238, name: 'Banda Aceh, Aceh' },

  // Kalimantan
  balikpapan: { lat: -1.2379, lng: 116.8529, name: 'Balikpapan, Kalimantan Timur' },
  samarinda: { lat: -0.5022, lng: 117.1536, name: 'Samarinda, Kalimantan Timur' },
  banjarmasin: { lat: -3.3194, lng: 114.5908, name: 'Banjarmasin, Kalimantan Selatan' },
  pontianak: { lat: -0.0263, lng: 109.3425, name: 'Pontianak, Kalimantan Barat' },
  palangkaraya: { lat: -2.2161, lng: 113.914, name: 'Palangka Raya, Kalimantan Tengah' },
  tarakan: { lat: 3.3274, lng: 117.5924, name: 'Tarakan, Kalimantan Utara' },
  ikn: { lat: -0.9744, lng: 116.7088, name: 'Ibu Kota Nusantara (IKN)' },
  nusantara: { lat: -0.9744, lng: 116.7088, name: 'Ibu Kota Nusantara (IKN)' },

  // Sulawesi
  makassar: { lat: -5.1477, lng: 119.4327, name: 'Kota Makassar, Sulawesi Selatan' },
  manado: { lat: 1.4748, lng: 124.8428, name: 'Kota Manado, Sulawesi Utara' },
  palu: { lat: -0.9003, lng: 119.878, name: 'Kota Palu, Sulawesi Tengah' },
  kendari: { lat: -3.9985, lng: 122.5126, name: 'Kendari, Sulawesi Tenggara' },
  gorontalo: { lat: 0.5435, lng: 123.0568, name: 'Gorontalo' },
  mamuju: { lat: -2.6775, lng: 118.8894, name: 'Mamuju, Sulawesi Barat' },

  // Maluku & Papua
  ambon: { lat: -3.6547, lng: 128.1906, name: 'Ambon, Maluku' },
  ternate: { lat: 0.7904, lng: 127.3821, name: 'Ternate, Maluku Utara' },
  jayapura: { lat: -2.5337, lng: 140.7181, name: 'Jayapura, Papua' },
  sorong: { lat: -0.8762, lng: 131.2558, name: 'Sorong, Papua Barat Daya' },
  manokwari: { lat: -0.8615, lng: 134.062, name: 'Manokwari, Papua Barat' },
  // International Global Cities
  'new york': { lat: 40.7128, lng: -74.006, name: 'New York, USA (Cross-Border Zone)' },
  delhi: { lat: 28.6139, lng: 77.209, name: 'New Delhi, India (Cross-Border Zone)' },
  'new delhi': { lat: 28.6139, lng: 77.209, name: 'New Delhi, India (Cross-Border Zone)' },
  india: { lat: 28.6139, lng: 77.209, name: 'New Delhi, India (Cross-Border Zone)' },
  shanghai: { lat: 31.2304, lng: 121.4737, name: 'Shanghai, China (Cross-Border Zone)' },
  china: { lat: 31.2304, lng: 121.4737, name: 'Shanghai, China (Cross-Border Zone)' },
  tokyo: { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan (Cross-Border Zone)' },
  japan: { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan (Cross-Border Zone)' },
  london: { lat: 51.5074, lng: -0.1278, name: 'London, United Kingdom (Cross-Border Zone)' },
  singapore: { lat: 1.3521, lng: 103.8198, name: 'Singapore (Cross-Border Zone)' },
  'kuala lumpur': { lat: 3.139, lng: 101.6869, name: 'Kuala Lumpur, Malaysia (Cross-Border Zone)' },
  malaysia: { lat: 3.139, lng: 101.6869, name: 'Kuala Lumpur, Malaysia (Cross-Border Zone)' },
  sydney: { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia (Cross-Border Zone)' },
  australia: { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia (Cross-Border Zone)' },
  dubai: { lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE (Cross-Border Zone)' },
  paris: { lat: 48.8566, lng: 2.3522, name: 'Paris, France (Cross-Border Zone)' },
  bangkok: { lat: 13.7563, lng: 100.5018, name: 'Bangkok, Thailand (Cross-Border Zone)' },
};

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
  const [searchFeedback, setSearchFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
    return `Location Pin (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`;
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

  // Initialize Interactive Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    async function initMap() {
      const L = (await import('leaflet')).default;

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

        // Drag pin event
        marker.on('dragend', async (e: any) => {
          const position = e.target.getLatLng();
          await updateCoordinates(position.lat, position.lng);
        });

        // Click anywhere on map event
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
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const moveMapTo = (newLat: number, newLng: number, zoomLevel = 14) => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([newLat, newLng]);
      mapInstanceRef.current.flyTo([newLat, newLng], zoomLevel, { duration: 1.2 });
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchFeedback({ type: 'error', message: 'Geolocation is not supported by your browser.' });
      return;
    }
    setLocating(true);
    setSearchFeedback(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = Number(position.coords.latitude.toFixed(6));
        const userLng = Number(position.coords.longitude.toFixed(6));
        moveMapTo(userLat, userLng, 15);
        await updateCoordinates(userLat, userLng);
        setSearchFeedback({ type: 'success', message: 'GPS coordinates detected & pinned!' });
        setLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setSearchFeedback({ type: 'error', message: 'Unable to retrieve GPS. Please search your city or click on the map.' });
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Robust Search Engine (Dictionary + OpenStreetMap Fallback)
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) return;

    setLocating(true);
    setSearchFeedback(null);

    // 1. Check local Indonesia dictionary (Instant & 100% Guaranteed)
    const matchedKey = Object.keys(INDONESIA_LOCATIONS).find(
      (key) => cleanQuery === key || cleanQuery.includes(key) || key.includes(cleanQuery)
    );

    if (matchedKey) {
      const match = INDONESIA_LOCATIONS[matchedKey];
      moveMapTo(match.lat, match.lng, 13);
      await updateCoordinates(match.lat, match.lng, match.name);
      setSearchFeedback({ type: 'success', message: `Pinned: ${match.name}` });
      setLocating(false);
      return;
    }

    // 2. OpenStreetMap Search Fallback (Worldwide Geocoding)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const searchLat = parseFloat(data[0].lat);
        const searchLng = parseFloat(data[0].lon);
        moveMapTo(searchLat, searchLng, 12);
        await updateCoordinates(searchLat, searchLng, data[0].display_name);
        setSearchFeedback({ type: 'success', message: `Pinned: ${data[0].display_name.split(',')[0]}` });
      } else {
        setSearchFeedback({
          type: 'error',
          message: `Location "${searchQuery}" not found. Try typing a major city name (e.g. Bandung, Surabaya, Medan, Bali, Dago) or click directly on the map.`,
        });
      }
    } catch (err) {
      console.warn('Geocoding error, falling back to approximate region:', err);
      setSearchFeedback({
        type: 'error',
        message: 'Network lookup timed out. Please click directly on the map or select a quick city preset below.',
      });
    } finally {
      setLocating(false);
    }
  };

  // Quick City Presets
  const PRESET_DESTINATIONS = [
    { label: 'Jakarta', lat: -6.1754, lng: 106.8272 },
    { label: 'Bandung', lat: -6.9175, lng: 107.6191 },
    { label: 'Surabaya', lat: -7.2575, lng: 112.7521 },
    { label: 'Bali (Denpasar)', lat: -8.6705, lng: 115.2126 },
    { label: 'Medan', lat: 3.5952, lng: 98.6722 },
    { label: 'Makassar', lat: -5.1477, lng: 119.4327 },
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
            <p className="text-[11px] text-slate-400">Click anywhere on the map or search to pin your location</p>
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
      <form onSubmit={handleSearchSubmit} className="space-y-1.5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type city or district (e.g. Bandung, Surabaya, Medan, Dago, Bali)..."
              className="w-full rounded-xl border border-white/10 bg-slate-800/90 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={locating}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            <span>Search</span>
          </button>
        </div>

        {searchFeedback && (
          <div
            className={`flex items-center gap-2 rounded-xl p-2.5 text-xs border ${
              searchFeedback.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            }`}
          >
            {searchFeedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            )}
            <span>{searchFeedback.message}</span>
          </div>
        )}
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
            <span className="font-semibold text-white block">Selected Delivery Destination:</span>
            <span className="text-slate-300">{addressLabel}</span>
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
                  setSearchFeedback({ type: 'success', message: `Pinned: ${preset.label}` });
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
