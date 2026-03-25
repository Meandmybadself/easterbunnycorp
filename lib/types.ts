export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  role: "adult" | "child";
  favoriteCandy?: string;
}

export interface FamilyRegistration {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Primary contact
  primaryName: string;
  email: string;
  phone: string;
  // Address
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  // Photo (base64)
  photoDataUrl?: string;
  // Members
  members: FamilyMember[];
  // Visit status (set by Bunny portal)
  visitStatus: "pending" | "scheduled" | "completed" | "missed";
  visitNote?: string;
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  category: "missed_appearance" | "complaint" | "general" | "feedback";
  subject: string;
  message: string;
  fromName: string;
  status: "open" | "resolved";
  bunnyReply?: string;
  bunnyRepliedAt?: string;
}

export interface BunnyAuthState {
  isAuthenticated: boolean;
  authenticatedAt?: string;
}

export type TrackerPhase =
  | "offline_before"
  | "eve_countdown"
  | "live"
  | "offline_after";
