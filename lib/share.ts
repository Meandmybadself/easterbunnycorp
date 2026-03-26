import type { FamilyRegistration, ContactMessage } from "./types";

export interface SharedState {
  v: 1;
  family: Omit<FamilyRegistration, "photoDataUrl"> | null;
  messages: ContactMessage[];
}

export function encodeState(
  family: FamilyRegistration | null,
  messages: ContactMessage[]
): string {
  // Strip photo — can be MB-sized
  const { photoDataUrl: _photo, ...familyWithoutPhoto } = family ?? ({} as FamilyRegistration);
  void _photo;

  const payload: SharedState = {
    v: 1,
    family: family ? familyWithoutPhoto : null,
    messages,
  };

  return btoa(encodeURIComponent(JSON.stringify(payload))).replace(/\s/g, "");
}

export function decodeState(encoded: string): SharedState | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded))) as SharedState;
  } catch {
    return null;
  }
}

export function buildShareUrl(encoded: string): string {
  const base =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "https://easterbunny.meandmybadself.com";
  return `${base}/restore/#${encoded}`;
}
