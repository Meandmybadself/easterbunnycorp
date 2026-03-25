"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";
import { PageHeader, SectionLabel } from "@/components/ui/SectionLabel";
import { getFamily, getMessages } from "@/lib/storage";
import type { FamilyRegistration, ContactMessage } from "@/lib/types";

const VISIT_STATUS_LABELS: Record<FamilyRegistration["visitStatus"], { label: string; color: string; icon: string }> = {
  pending:   { label: "PENDING REVIEW",    color: "bg-yellow-light border-yellow",   icon: "⏳" },
  scheduled: { label: "VISIT SCHEDULED",   color: "bg-mint-light border-mint",       icon: "✅" },
  completed: { label: "VISIT COMPLETED",   color: "bg-sage-light border-sage",       icon: "🎉" },
  missed:    { label: "MISSED APPEARANCE", color: "bg-pink-light border-alert",      icon: "⚠️" },
};

const CATEGORY_LABELS: Record<ContactMessage["category"], string> = {
  missed_appearance: "MISSED APPEARANCE",
  complaint:         "COMPLAINT",
  general:           "GENERAL ENQUIRY",
  feedback:          "FEEDBACK",
};

export default function DashboardPage() {
  const router = useRouter();
  const [family, setFamily] = useState<FamilyRegistration | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFamily(getFamily());
    setMessages(getMessages());
  }, []);

  if (!mounted) return null;

  if (!family) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="FAMILY DASHBOARD"
          title="No Registration Found"
          subtitle="You have not yet registered your family for an Easter visit."
          accent="yellow"
        />
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
          <p className="text-sm text-muted">
            Please complete the registration form to create your family file.
          </p>
          <Link href="/register">
            <Button size="lg">REGISTER NOW</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const status = VISIT_STATUS_LABELS[family.visitStatus];
  const children = family.members.filter((m) => m.role === "child");
  const adults = family.members.filter((m) => m.role === "adult");
  const openMessages = messages.filter((m) => m.status === "open");
  const resolvedMessages = messages.filter((m) => m.status === "resolved");

  return (
    <PageShell>
      <PageHeader
        eyebrow="FAMILY DASHBOARD"
        title={`File: ${family.primaryName}`}
        subtitle={`Registration ID: ${family.id} — Last updated: ${new Date(family.updatedAt).toLocaleDateString()}`}
        accent="sage"
      />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* Visit status */}
        <div className={`border-l-4 p-5 ${status.color}`}>
          <div className="text-[10px] font-bold tracking-[0.2em] text-muted mb-1">VISIT STATUS</div>
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>{status.icon}</span>
            <span className="text-xl font-bold">{status.label}</span>
          </div>
          {family.visitNote && (
            <div className="mt-3 p-3 bg-white/60 border border-border">
              <div className="text-[10px] font-bold tracking-[0.15em] text-muted mb-1">NOTE FROM THE EASTER BUNNY</div>
              <p className="text-sm italic">"{family.visitNote}"</p>
            </div>
          )}
        </div>

        {/* Family photo + summary */}
        <div className="space-y-4">
          <SectionLabel>REGISTERED FAMILY</SectionLabel>
          <div className="flex flex-col sm:flex-row gap-6">
            {family.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={family.photoDataUrl}
                alt="Family"
                className="w-32 h-32 object-cover border-2 border-ink flex-shrink-0"
              />
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-border flex items-center justify-center text-muted text-[10px] tracking-wide flex-shrink-0">
                NO PHOTO
              </div>
            )}
            <div className="space-y-3 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-[12px]">
                <div>
                  <span className="font-bold tracking-wide text-muted text-[10px]">PRIMARY CONTACT</span>
                  <p className="font-bold">{family.primaryName}</p>
                </div>
                <div>
                  <span className="font-bold tracking-wide text-muted text-[10px]">EMAIL</span>
                  <p>{family.email}</p>
                </div>
                <div>
                  <span className="font-bold tracking-wide text-muted text-[10px]">ADDRESS</span>
                  <p>{family.address}, {family.city}{family.state ? `, ${family.state}` : ""} {family.postalCode}</p>
                  <p>{family.country}</p>
                </div>
                {family.phone && (
                  <div>
                    <span className="font-bold tracking-wide text-muted text-[10px]">PHONE</span>
                    <p>{family.phone}</p>
                  </div>
                )}
              </div>
              <Link href="/register">
                <Button variant="ghost" size="sm" className="mt-2">EDIT REGISTRATION</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="space-y-4">
          <SectionLabel>HOUSEHOLD MEMBERS</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-border bg-border">
            {[...adults, ...children].map((m) => (
              <div key={m.id} className="bg-cream p-4 flex items-start gap-3">
                <span className="text-xl mt-0.5" aria-hidden>{m.role === "child" ? "🧒" : "🧑"}</span>
                <div>
                  <div className="font-bold text-sm">{m.name}</div>
                  <div className="text-[11px] text-muted">
                    Age {m.age} — {m.role === "child" ? "Child" : "Adult"}
                  </div>
                  {m.favoriteCandy && (
                    <div className="text-[11px] text-muted mt-0.5">
                      Favourite candy: <span className="text-ink">{m.favoriteCandy}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <SectionLabel className="flex-1">MESSAGES & COMPLAINTS</SectionLabel>
            <Link href="/contact">
              <Button variant="secondary" size="sm">+ NEW MESSAGE</Button>
            </Link>
          </div>

          {messages.length === 0 ? (
            <div className="border border-dashed border-border p-6 text-center text-[12px] text-muted">
              No messages on file. Use the contact form to submit a complaint or enquiry.
            </div>
          ) : (
            <div className="space-y-3">
              {[...openMessages, ...resolvedMessages].map((msg) => (
                <div key={msg.id} className={`border p-4 space-y-2 ${msg.status === "resolved" ? "border-border bg-cream-dark opacity-75" : "border-border bg-cream"}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-bold tracking-[0.15em] bg-ink text-cream px-2 py-0.5">
                      {CATEGORY_LABELS[msg.category]}
                    </span>
                    <span className={`text-[10px] font-bold tracking-[0.12em] px-2 py-0.5 border ${msg.status === "resolved" ? "border-sage text-sage" : "border-yellow text-muted"}`}>
                      {msg.status === "resolved" ? "RESOLVED" : "OPEN"}
                    </span>
                    <span className="text-[10px] text-muted ml-auto">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="font-bold text-sm">{msg.subject}</div>
                  <p className="text-[12px] text-muted">{msg.message}</p>

                  {msg.bunnyReply && (
                    <div className="mt-3 border-l-4 border-pink pl-4 bg-pink-light p-3">
                      <div className="text-[10px] font-bold tracking-[0.15em] text-muted mb-1">
                        🐰 REPLY FROM THE EASTER BUNNY — {msg.bunnyRepliedAt ? new Date(msg.bunnyRepliedAt).toLocaleDateString() : ""}
                      </div>
                      <p className="text-[12px] italic">"{msg.bunnyReply}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="border-t border-border pt-6 flex flex-wrap gap-3">
          <Link href="/tracker"><Button variant="secondary">BUNNY TRACKER</Button></Link>
          <Link href="/contact"><Button variant="ghost">CONTACT / COMPLAINTS</Button></Link>
        </div>

      </div>
    </PageShell>
  );
}
