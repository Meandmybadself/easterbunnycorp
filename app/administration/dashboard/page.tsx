"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  getBunnyAuth,
  clearBunnyAuth,
  getFamily,
  saveFamily,
  getMessages,
  updateMessage,
  getBunnyPin,
  setBunnyPin,
  generateId,
} from "@/lib/storage";
import type { FamilyRegistration, ContactMessage } from "@/lib/types";

const VISIT_STATUS_OPTIONS: { value: FamilyRegistration["visitStatus"]; label: string }[] = [
  { value: "pending",   label: "Pending Review" },
  { value: "scheduled", label: "Visit Scheduled" },
  { value: "completed", label: "Visit Completed" },
  { value: "missed",    label: "Missed Appearance" },
];

const CATEGORY_LABELS: Record<ContactMessage["category"], string> = {
  missed_appearance: "MISSED APPEARANCE",
  complaint:         "COMPLAINT",
  general:           "GENERAL ENQUIRY",
  feedback:          "FEEDBACK",
};

export default function AdministrationDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [family, setFamily] = useState<FamilyRegistration | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Visit management
  const [visitStatus, setVisitStatus] = useState<FamilyRegistration["visitStatus"]>("pending");
  const [visitNote, setVisitNote] = useState("");
  const [visitSaved, setVisitSaved] = useState(false);

  // Reply state: messageId → draft text
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [replySaved, setReplySaved] = useState<Record<string, boolean>>({});

  // PIN change
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSaved, setPinSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = getBunnyAuth();
    if (!auth.isAuthenticated) {
      router.replace("/administration");
      return;
    }
    const f = getFamily();
    setFamily(f);
    if (f) {
      setVisitStatus(f.visitStatus);
      setVisitNote(f.visitNote ?? "");
    }
    setMessages(getMessages());
  }, [router]);

  const handleLogout = () => {
    clearBunnyAuth();
    router.push("/administration");
  };

  const saveVisitStatus = () => {
    if (!family) return;
    const updated: FamilyRegistration = {
      ...family,
      visitStatus,
      visitNote: visitNote.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    saveFamily(updated);
    setFamily(updated);
    setVisitSaved(true);
    setTimeout(() => setVisitSaved(false), 2000);
  };

  const submitReply = (msgId: string) => {
    const text = replies[msgId]?.trim();
    if (!text) return;
    updateMessage(msgId, {
      bunnyReply: text,
      bunnyRepliedAt: new Date().toISOString(),
      status: "resolved",
    });
    setMessages(getMessages());
    setReplySaved((p) => ({ ...p, [msgId]: true }));
    setTimeout(() => setReplySaved((p) => ({ ...p, [msgId]: false })), 2000);
  };

  const handlePinChange = () => {
    setPinError("");
    if (newPin.length < 4) { setPinError("PIN must be at least 4 digits."); return; }
    if (newPin !== confirmPin) { setPinError("PINs do not match."); return; }
    setBunnyPin(newPin);
    setNewPin("");
    setConfirmPin("");
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 2000);
  };

  if (!mounted) return null;

  const openMessages = messages.filter((m) => m.status === "open");
  const resolvedMessages = messages.filter((m) => m.status === "resolved");

  return (
    <div className="min-h-screen bg-cream">
      {/* Portal header */}
      <header className="border-b-2 border-ink bg-ink text-cream">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <span className="text-2xl" aria-hidden>🐰</span>
          <div>
            <div className="text-[10px] tracking-[0.2em] text-cream/50">ADMINISTRATION PORTAL</div>
            <div className="text-base font-bold tracking-tight">EASTER BUNNY CORP.</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-[10px] tracking-[0.15em] text-cream/50 hidden sm:block">
              SESSION ACTIVE
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="border-cream/20 text-cream hover:bg-cream/10 hover:border-cream/40"
            >
              LOG OUT
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* Summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-border bg-border">
          {[
            { label: "OPEN MESSAGES", value: String(openMessages.length), accent: openMessages.length > 0 ? "bg-pink-light" : "bg-cream" },
            { label: "RESOLVED", value: String(resolvedMessages.length), accent: "bg-cream" },
            { label: "FAMILY STATUS", value: family ? family.visitStatus.toUpperCase() : "N/A", accent: "bg-yellow-light" },
            { label: "MEMBERS", value: family ? String(family.members.length) : "0", accent: "bg-lavender-light" },
          ].map(({ label, value, accent }) => (
            <div key={label} className={`${accent} p-4 text-center`}>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-[10px] tracking-[0.15em] text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Visit management */}
        <section className="space-y-5">
          <SectionLabel>VISIT MANAGEMENT</SectionLabel>
          {!family ? (
            <div className="border border-dashed border-border p-6 text-center text-[12px] text-muted">
              No registered family found on this device.
            </div>
          ) : (
            <div className="border border-border p-6 bg-cream space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.15em] text-muted mb-1">REGISTERED FAMILY</div>
                  <div className="font-bold">{family.primaryName}</div>
                  <div className="text-[12px] text-muted">{family.address}, {family.city} {family.postalCode}</div>
                  <div className="text-[12px] text-muted mt-1">
                    {family.members.length} member{family.members.length !== 1 ? "s" : ""} —{" "}
                    {family.members.filter((m) => m.role === "child").length} child{family.members.filter((m) => m.role === "child").length !== 1 ? "ren" : ""}
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField label="VISIT STATUS">
                    <Select
                      value={visitStatus}
                      onChange={(e) => setVisitStatus(e.target.value as FamilyRegistration["visitStatus"])}
                    >
                      {VISIT_STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="NOTE TO FAMILY">
                    <Textarea
                      rows={3}
                      value={visitNote}
                      onChange={(e) => setVisitNote(e.target.value)}
                      placeholder="e.g. Eggs hidden in back garden — check the flower beds!"
                    />
                  </FormField>
                  <div className="flex items-center gap-3">
                    <Button onClick={saveVisitStatus}>SAVE STATUS</Button>
                    {visitSaved && (
                      <span className="text-[11px] font-bold text-sage tracking-wide">✓ SAVED</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Messages */}
        <section className="space-y-5">
          <SectionLabel>OPEN MESSAGES ({openMessages.length})</SectionLabel>
          {openMessages.length === 0 ? (
            <div className="border border-dashed border-border p-6 text-center text-[12px] text-muted">
              No open messages.
            </div>
          ) : (
            <div className="space-y-4">
              {openMessages.map((msg) => (
                <MessageCard
                  key={msg.id}
                  msg={msg}
                  replyDraft={replies[msg.id] ?? ""}
                  onDraftChange={(v) => setReplies((p) => ({ ...p, [msg.id]: v }))}
                  onSubmit={() => submitReply(msg.id)}
                  saved={!!replySaved[msg.id]}
                />
              ))}
            </div>
          )}
        </section>

        {resolvedMessages.length > 0 && (
          <section className="space-y-5">
            <SectionLabel>RESOLVED MESSAGES ({resolvedMessages.length})</SectionLabel>
            <div className="space-y-3 opacity-70">
              {resolvedMessages.map((msg) => (
                <div key={msg.id} className="border border-border p-4 bg-cream-dark space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold tracking-[0.12em] bg-ink text-cream px-2 py-0.5">
                      {CATEGORY_LABELS[msg.category]}
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.12em] text-sage">✓ RESOLVED</span>
                    <span className="ml-auto text-[10px] text-muted">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm font-bold">{msg.subject}</div>
                  <p className="text-[12px] text-muted">{msg.message}</p>
                  {msg.bunnyReply && (
                    <div className="border-l-4 border-pink pl-3 mt-2">
                      <div className="text-[10px] font-bold text-muted mb-0.5">YOUR REPLY</div>
                      <p className="text-[12px] italic">"{msg.bunnyReply}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PIN change */}
        <section className="space-y-5">
          <SectionLabel>CHANGE ACCESS PIN</SectionLabel>
          <div className="border border-border p-6 bg-cream max-w-sm space-y-4">
            <FormField label="NEW PIN" hint="Minimum 4 digits.">
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={newPin}
                onChange={(e) => { setNewPin(e.target.value.replace(/\D/g, "")); setPinError(""); }}
                placeholder="••••"
              />
            </FormField>
            <FormField label="CONFIRM NEW PIN" error={pinError}>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={confirmPin}
                onChange={(e) => { setConfirmPin(e.target.value.replace(/\D/g, "")); setPinError(""); }}
                placeholder="••••"
              />
            </FormField>
            <div className="flex items-center gap-3">
              <Button onClick={handlePinChange} disabled={!newPin || !confirmPin}>
                UPDATE PIN
              </Button>
              {pinSaved && (
                <span className="text-[11px] font-bold text-sage tracking-wide">✓ UPDATED</span>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function MessageCard({
  msg,
  replyDraft,
  onDraftChange,
  onSubmit,
  saved,
}: {
  msg: ContactMessage;
  replyDraft: string;
  onDraftChange: (v: string) => void;
  onSubmit: () => void;
  saved: boolean;
}) {
  return (
    <div className="border border-border p-5 bg-cream space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold tracking-[0.12em] bg-ink text-cream px-2 py-0.5">
          {CATEGORY_LABELS[msg.category]}
        </span>
        <span className="text-[10px] text-muted">From: <strong>{msg.fromName}</strong></span>
        <span className="ml-auto text-[10px] text-muted">
          {new Date(msg.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div>
        <div className="font-bold text-sm">{msg.subject}</div>
        <p className="text-[12px] text-muted mt-1">{msg.message}</p>
      </div>
      <div className="border-t border-border pt-4 space-y-3">
        <FormField label="REPLY AS THE EASTER BUNNY">
          <Textarea
            rows={3}
            value={replyDraft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="Write a reply… This will appear in the family's dashboard."
          />
        </FormField>
        <div className="flex items-center gap-3">
          <Button
            onClick={onSubmit}
            disabled={!replyDraft.trim()}
            variant="primary"
            size="sm"
          >
            SEND REPLY & RESOLVE
          </Button>
          {saved && (
            <span className="text-[11px] font-bold text-sage tracking-wide">✓ REPLY SENT</span>
          )}
        </div>
      </div>
    </div>
  );
}
