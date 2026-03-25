"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker, Polyline as LeafletPolyline } from "leaflet";
import { BUNNY_ROUTE, getTrackerPosition } from "@/lib/tracker";

interface BunnyMapProps {
  progress: number;
}

export default function BunnyMap({ progress }: BunnyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const trailRef = useRef<LeafletPolyline | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Leaflet must be imported dynamically (no SSR)
    import("leaflet").then((L) => {
      // Fix default icon paths for static export
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [30, 0],
        zoom: 2,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 8,
      }).addTo(map);

      // Route polyline (full route, faded)
      const routeCoords = BUNNY_ROUTE.map((s) => [s.lat, s.lng] as [number, number]);
      L.polyline(routeCoords, {
        color: "#C4B0D8",
        weight: 1.5,
        dashArray: "4 6",
        opacity: 0.5,
      }).addTo(map);

      // Travelled trail
      const trail = L.polyline([], {
        color: "#E8B4BC",
        weight: 3,
        opacity: 0.8,
      }).addTo(map);
      trailRef.current = trail;

      // Bunny marker
      const bunnyIcon = L.divIcon({
        html: `<div style="font-size:24px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3))">🐰</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        className: "",
      });

      const [lat, lng] = getTrackerPosition(progress);
      const marker = L.marker([lat, lng], { icon: bunnyIcon }).addTo(map);
      markerRef.current = marker;

      mapRef.current = map;

      // Draw initial trail
      updateTrail(progress, trail, marker);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      trailRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update position when progress changes
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !trailRef.current) return;
    const [lat, lng] = getTrackerPosition(progress);
    markerRef.current.setLatLng([lat, lng]);
    updateTrail(progress, trailRef.current, markerRef.current);
  }, [progress]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div ref={containerRef} className="w-full h-64 sm:h-96 border border-border" />
    </>
  );
}

function updateTrail(
  progress: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trail: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  marker: any
) {
  import("leaflet").then((L) => {
    const totalStops = BUNNY_ROUTE.length - 1;
    const rawIndex = progress * totalStops;
    const fromIndex = Math.floor(rawIndex);
    const [lat, lng] = marker.getLatLng
      ? [marker.getLatLng().lat, marker.getLatLng().lng]
      : [0, 0];

    const travelled: [number, number][] = BUNNY_ROUTE.slice(0, fromIndex + 1).map(
      (s) => [s.lat, s.lng]
    );
    travelled.push([lat, lng]);
    trail.setLatLngs(travelled);
    void L; // suppress unused
  });
}
