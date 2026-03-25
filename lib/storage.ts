import type { FamilyRegistration, ContactMessage, BunnyAuthState } from "./types";

const KEYS = {
  FAMILY: "ebcorp_family",
  MESSAGES: "ebcorp_messages",
  BUNNY_AUTH: "ebcorp_bunny_auth",
  BUNNY_PIN: "ebcorp_bunny_pin",
} as const;

// ── Family ────────────────────────────────────────────────────────────────────

export function getFamily(): FamilyRegistration | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEYS.FAMILY);
    return raw ? (JSON.parse(raw) as FamilyRegistration) : null;
  } catch {
    return null;
  }
}

export function saveFamily(data: FamilyRegistration): void {
  localStorage.setItem(KEYS.FAMILY, JSON.stringify(data));
}

export function clearFamily(): void {
  localStorage.removeItem(KEYS.FAMILY);
}

// ── Messages ──────────────────────────────────────────────────────────────────

export function getMessages(): ContactMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.MESSAGES);
    return raw ? (JSON.parse(raw) as ContactMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: ContactMessage[]): void {
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
}

export function addMessage(msg: ContactMessage): void {
  const msgs = getMessages();
  msgs.unshift(msg);
  saveMessages(msgs);
}

export function updateMessage(id: string, updates: Partial<ContactMessage>): void {
  const msgs = getMessages();
  const idx = msgs.findIndex((m) => m.id === id);
  if (idx >= 0) {
    msgs[idx] = { ...msgs[idx], ...updates };
    saveMessages(msgs);
  }
}

// ── Bunny Auth ────────────────────────────────────────────────────────────────

const BUNNY_SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

export function getBunnyAuth(): BunnyAuthState {
  if (typeof window === "undefined") return { isAuthenticated: false };
  try {
    const raw = localStorage.getItem(KEYS.BUNNY_AUTH);
    if (!raw) return { isAuthenticated: false };
    const state = JSON.parse(raw) as BunnyAuthState;
    if (state.isAuthenticated && state.authenticatedAt) {
      const elapsed = Date.now() - new Date(state.authenticatedAt).getTime();
      if (elapsed > BUNNY_SESSION_DURATION_MS) {
        clearBunnyAuth();
        return { isAuthenticated: false };
      }
    }
    return state;
  } catch {
    return { isAuthenticated: false };
  }
}

export function setBunnyAuth(authenticated: boolean): void {
  const state: BunnyAuthState = {
    isAuthenticated: authenticated,
    authenticatedAt: authenticated ? new Date().toISOString() : undefined,
  };
  localStorage.setItem(KEYS.BUNNY_AUTH, JSON.stringify(state));
}

export function clearBunnyAuth(): void {
  localStorage.removeItem(KEYS.BUNNY_AUTH);
}

// ── Bunny PIN ─────────────────────────────────────────────────────────────────

const DEFAULT_PIN = "9274"; // default PIN, parents should change

export function getBunnyPin(): string {
  if (typeof window === "undefined") return DEFAULT_PIN;
  return localStorage.getItem(KEYS.BUNNY_PIN) ?? DEFAULT_PIN;
}

export function setBunnyPin(pin: string): void {
  localStorage.setItem(KEYS.BUNNY_PIN, pin);
}

// ── ID generation ─────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
