/**
 * Simulates the Easter Bunny's route on Easter morning.
 * The bunny departs the North Pole at 00:00 local time and completes
 * the route by 23:59. Progress is calculated based on current time.
 */

export interface RouteStop {
  name: string;
  lat: number;
  lng: number;
  localTime: string; // approximate local arrival (HH:MM)
}

// A curated world-spanning route
export const BUNNY_ROUTE: RouteStop[] = [
  { name: "The North Pole", lat: 90, lng: 0, localTime: "00:00" },
  { name: "Reykjavik, Iceland", lat: 64.13, lng: -21.93, localTime: "01:30" },
  { name: "Dublin, Ireland", lat: 53.33, lng: -6.25, localTime: "02:30" },
  { name: "London, United Kingdom", lat: 51.51, lng: -0.13, localTime: "03:00" },
  { name: "Paris, France", lat: 48.85, lng: 2.35, localTime: "04:00" },
  { name: "Berlin, Germany", lat: 52.52, lng: 13.4, localTime: "04:30" },
  { name: "Warsaw, Poland", lat: 52.23, lng: 21.01, localTime: "05:00" },
  { name: "Athens, Greece", lat: 37.98, lng: 23.73, localTime: "05:30" },
  { name: "Cairo, Egypt", lat: 30.04, lng: 31.24, localTime: "06:00" },
  { name: "Istanbul, Turkey", lat: 41.01, lng: 28.96, localTime: "06:30" },
  { name: "Moscow, Russia", lat: 55.75, lng: 37.62, localTime: "07:00" },
  { name: "Dubai, UAE", lat: 25.2, lng: 55.27, localTime: "07:30" },
  { name: "Mumbai, India", lat: 19.08, lng: 72.88, localTime: "08:00" },
  { name: "Bangkok, Thailand", lat: 13.76, lng: 100.5, localTime: "08:30" },
  { name: "Singapore", lat: 1.35, lng: 103.82, localTime: "09:00" },
  { name: "Hong Kong", lat: 22.32, lng: 114.17, localTime: "09:30" },
  { name: "Tokyo, Japan", lat: 35.68, lng: 139.69, localTime: "10:00" },
  { name: "Sydney, Australia", lat: -33.87, lng: 151.21, localTime: "10:30" },
  { name: "Auckland, New Zealand", lat: -36.87, lng: 174.77, localTime: "11:00" },
  { name: "Honolulu, Hawaii", lat: 21.31, lng: -157.86, localTime: "12:00" },
  { name: "Los Angeles, USA", lat: 34.05, lng: -118.24, localTime: "13:00" },
  { name: "Denver, USA", lat: 39.74, lng: -104.98, localTime: "14:00" },
  { name: "Chicago, USA", lat: 41.88, lng: -87.63, localTime: "15:00" },
  { name: "New York, USA", lat: 40.71, lng: -74.01, localTime: "16:00" },
  { name: "Toronto, Canada", lat: 43.65, lng: -79.38, localTime: "16:30" },
  { name: "Mexico City, Mexico", lat: 19.43, lng: -99.13, localTime: "17:00" },
  { name: "Bogotá, Colombia", lat: 4.71, lng: -74.07, localTime: "17:30" },
  { name: "São Paulo, Brazil", lat: -23.55, lng: -46.63, localTime: "18:00" },
  { name: "Buenos Aires, Argentina", lat: -34.6, lng: -58.38, localTime: "18:30" },
  { name: "The North Pole", lat: 90, lng: 0, localTime: "23:59" },
];

/** Returns 0–1 progress through the route based on current time on Easter day. */
export function getTrackerProgress(now: Date): number {
  const hours = now.getHours() + now.getMinutes() / 60;
  // Route spans 00:00 to 23:59
  return Math.min(1, Math.max(0, hours / 24));
}

/** Returns the interpolated [lat, lng] for a given 0–1 progress. */
export function getTrackerPosition(progress: number): [number, number] {
  const totalStops = BUNNY_ROUTE.length - 1;
  const rawIndex = progress * totalStops;
  const fromIndex = Math.floor(rawIndex);
  const toIndex = Math.min(fromIndex + 1, totalStops);
  const t = rawIndex - fromIndex;

  const from = BUNNY_ROUTE[fromIndex];
  const to = BUNNY_ROUTE[toIndex];

  return [
    from.lat + (to.lat - from.lat) * t,
    from.lng + (to.lng - from.lng) * t,
  ];
}

/** Returns the nearest named stop for display. */
export function getNearestStop(progress: number): RouteStop {
  const totalStops = BUNNY_ROUTE.length - 1;
  const rawIndex = progress * totalStops;
  const idx = Math.round(rawIndex);
  return BUNNY_ROUTE[Math.min(idx, totalStops)];
}

/** Returns a status message based on progress. */
export function getStatusMessage(progress: number): string {
  if (progress < 0.02) return "DEPARTING NORTH POLE — OPERATIONS COMMENCED";
  if (progress < 0.15) return "TRAVERSING NORTH ATLANTIC SECTOR";
  if (progress < 0.35) return "ACTIVE IN EUROPEAN ZONE";
  if (progress < 0.5) return "PROCEEDING THROUGH ASIA-PACIFIC CORRIDOR";
  if (progress < 0.65) return "OPERATIONS UNDERWAY IN OCEANIA";
  if (progress < 0.8) return "ACTIVE IN AMERICAS SECTOR";
  if (progress < 0.95) return "COMPLETING WESTERN HEMISPHERE ROUTE";
  return "RETURNING TO BASE — MISSION NEARLY COMPLETE";
}
