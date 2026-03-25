"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { PageHeader, SectionLabel } from "@/components/ui/SectionLabel";
import { addMessage, generateId } from "@/lib/storage";
import type { ContactMessage } from "@/lib/types";

const CATEGORIES: { value: ContactMessage["category"]; label: string }[] = [
  { value: "missed_appearance", label: "Missed Appearance" },
  { value: "complaint",         label: "Complaint" },
  { value: "general",           label: "General Enquiry" },
  { value: "feedback",          label: "Feedback / Compliment" },
];

export default function ContactPage() {
  const router = useRouter();
  const [fromName, setFromName] = useState("");
  const [category, setCategory] = useState<ContactMessage["category"]>("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!fromName.trim()) e.fromName = "Required.";
    if (!subject.trim()) e.subject = "Required.";
    if (!message.trim()) e.message = "Required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const msg: ContactMessage = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      category,
      subject: subject.trim(),
      message: message.trim(),
      fromName: fromName.trim(),
      status: "open",
    };

    addMessage(msg);
    setSubmitted(true);
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="CONTACT & COMPLAINTS"
        title="Submit a Message"
        subtitle="Use this form to report missed appearances, file complaints, or send a general enquiry. All messages are stored on this device."
        accent="lavender"
      />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {submitted ? (
          <div className="border-l-4 border-mint p-6 bg-mint-light space-y-4">
            <div className="text-[10px] font-bold tracking-[0.2em] text-muted">MESSAGE RECEIVED</div>
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>📬</span>
              <div>
                <p className="font-bold text-lg">Your message has been filed.</p>
                <p className="text-[12px] text-muted mt-1">
                  It has been logged on this device. The Easter Bunny will respond through your family dashboard.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => router.push("/dashboard")}>GO TO MY DASHBOARD</Button>
              <Button variant="ghost" onClick={() => { setSubmitted(false); setFromName(""); setSubject(""); setMessage(""); setCategory("general"); }}>
                SUBMIT ANOTHER
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              <SectionLabel>YOUR DETAILS</SectionLabel>
              <FormField label="YOUR NAME" required error={errors.fromName}>
                <Input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  error={!!errors.fromName}
                  placeholder="Jane Smith"
                />
              </FormField>
            </div>

            <div className="space-y-5">
              <SectionLabel>MESSAGE DETAILS</SectionLabel>
              <FormField label="CATEGORY" required>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ContactMessage["category"])}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="SUBJECT" required error={errors.subject}>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  error={!!errors.subject}
                  placeholder="Brief description of your issue"
                />
              </FormField>

              <FormField label="MESSAGE" required error={errors.message}>
                <Textarea
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  error={!!errors.message}
                  placeholder="Please describe your issue in detail…"
                />
              </FormField>
            </div>

            {/* Notice */}
            <div className="border border-border p-4 bg-cream-dark">
              <p className="text-[11px] text-muted leading-relaxed">
                <span className="font-bold">Note:</span> This message will be stored on this device only.
                To receive a reply, the registered parent must check the family dashboard.
                Response times may vary depending on operational workload.
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <Button type="submit" size="lg">SUBMIT MESSAGE</Button>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
}
