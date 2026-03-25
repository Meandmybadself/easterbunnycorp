"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/FormField";
import { PageHeader, SectionLabel } from "@/components/ui/SectionLabel";
import { saveFamily, getFamily, generateId } from "@/lib/storage";
import type { FamilyMember, FamilyRegistration } from "@/lib/types";
import { useEffect } from "react";

interface MemberDraft {
  id: string;
  name: string;
  age: string;
  role: "adult" | "child";
  favoriteCandy: string;
}

function emptyMember(): MemberDraft {
  return { id: generateId(), name: "", age: "", role: "child", favoriteCandy: "" };
}

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prefill from existing registration
  const [existing, setExisting] = useState<FamilyRegistration | null>(null);
  const [primaryName, setPrimaryName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [members, setMembers] = useState<MemberDraft[]>([emptyMember()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const reg = getFamily();
    if (reg) {
      setExisting(reg);
      setPrimaryName(reg.primaryName);
      setEmail(reg.email);
      setPhone(reg.phone);
      setAddress(reg.address);
      setCity(reg.city);
      setState(reg.state);
      setPostalCode(reg.postalCode);
      setCountry(reg.country);
      setPhotoDataUrl(reg.photoDataUrl);
      setMembers(
        reg.members.map((m) => ({
          id: m.id,
          name: m.name,
          age: String(m.age),
          role: m.role,
          favoriteCandy: m.favoriteCandy ?? "",
        }))
      );
    }
  }, []);

  const handlePhoto = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoDataUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const addMember = () => setMembers((m) => [...m, emptyMember()]);
  const removeMember = (id: string) => setMembers((m) => m.filter((x) => x.id !== id));
  const updateMember = (id: string, field: keyof MemberDraft, value: string) => {
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!primaryName.trim()) e.primaryName = "Required.";
    if (!email.trim() || !email.includes("@")) e.email = "Valid email required.";
    if (!address.trim()) e.address = "Required.";
    if (!city.trim()) e.city = "Required.";
    if (!postalCode.trim()) e.postalCode = "Required.";
    members.forEach((m, i) => {
      if (!m.name.trim()) e[`member_name_${i}`] = "Required.";
      if (!m.age || isNaN(Number(m.age)) || Number(m.age) < 0)
        e[`member_age_${i}`] = "Valid age required.";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const parsedMembers: FamilyMember[] = members.map((m) => ({
      id: m.id,
      name: m.name.trim(),
      age: Number(m.age),
      role: m.role,
      favoriteCandy: m.favoriteCandy.trim() || undefined,
    }));

    const now = new Date().toISOString();
    const registration: FamilyRegistration = {
      id: existing?.id ?? generateId(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      primaryName: primaryName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      photoDataUrl,
      members: parsedMembers,
      visitStatus: existing?.visitStatus ?? "pending",
      visitNote: existing?.visitNote,
    };

    saveFamily(registration);
    router.push("/dashboard");
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="FAMILY REGISTRATION FORM"
        title={existing ? "Update Your Registration" : "Register Your Family"}
        subtitle="Complete all required fields. Your data is stored only on this device."
        accent="pink"
      />

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        {/* Primary contact */}
        <div className="space-y-6">
          <SectionLabel>PRIMARY CONTACT</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="FULL NAME" required error={errors.primaryName}>
              <Input
                value={primaryName}
                onChange={(e) => setPrimaryName(e.target.value)}
                error={!!errors.primaryName}
                placeholder="Jane Smith"
              />
            </FormField>
            <FormField label="EMAIL ADDRESS" required error={errors.email}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                placeholder="jane@example.com"
              />
            </FormField>
            <FormField label="PHONE NUMBER">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000 0000"
              />
            </FormField>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-6">
          <SectionLabel>DELIVERY ADDRESS</SectionLabel>
          <div className="space-y-5">
            <FormField label="STREET ADDRESS" required error={errors.address}>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={!!errors.address}
                placeholder="123 Main Street"
              />
            </FormField>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <FormField label="CITY" required error={errors.city} className="col-span-2">
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  error={!!errors.city}
                  placeholder="Springfield"
                />
              </FormField>
              <FormField label="STATE / REGION">
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="IL"
                />
              </FormField>
              <FormField label="POSTAL CODE" required error={errors.postalCode}>
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  error={!!errors.postalCode}
                  placeholder="62701"
                />
              </FormField>
            </div>
            <FormField label="COUNTRY">
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
              />
            </FormField>
          </div>
        </div>

        {/* Family photo */}
        <div className="space-y-6">
          <SectionLabel>FAMILY PHOTO</SectionLabel>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {photoDataUrl ? (
              <div className="flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoDataUrl}
                  alt="Family photo"
                  className="w-32 h-32 object-cover border-2 border-ink"
                />
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-border flex items-center justify-center text-muted text-[11px] tracking-wide flex-shrink-0">
                NO PHOTO
              </div>
            )}
            <div className="flex flex-col gap-3">
              <p className="text-[12px] text-muted leading-relaxed">
                Upload a family photo for your official file. JPEG or PNG, max 5MB.
                The image is stored locally on this device only.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoDataUrl ? "CHANGE PHOTO" : "UPLOAD PHOTO"}
                </Button>
                {photoDataUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPhotoDataUrl(undefined)}
                  >
                    REMOVE
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Family members */}
        <div className="space-y-6">
          <SectionLabel>FAMILY MEMBERS</SectionLabel>
          <div className="space-y-4">
            {members.map((member, i) => (
              <div key={member.id} className="border border-border p-5 bg-cream-dark space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-muted">
                    MEMBER {String(i + 1).padStart(2, "0")}
                  </span>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="text-[10px] font-bold tracking-wide text-alert hover:underline"
                    >
                      REMOVE
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <FormField
                    label="FULL NAME"
                    required
                    error={errors[`member_name_${i}`]}
                    className="col-span-2"
                  >
                    <Input
                      value={member.name}
                      onChange={(e) => updateMember(member.id, "name", e.target.value)}
                      error={!!errors[`member_name_${i}`]}
                      placeholder="Name"
                    />
                  </FormField>
                  <FormField label="AGE" required error={errors[`member_age_${i}`]}>
                    <Input
                      type="number"
                      min="0"
                      max="120"
                      value={member.age}
                      onChange={(e) => updateMember(member.id, "age", e.target.value)}
                      error={!!errors[`member_age_${i}`]}
                      placeholder="0"
                    />
                  </FormField>
                  <FormField label="ROLE">
                    <Select
                      value={member.role}
                      onChange={(e) =>
                        updateMember(member.id, "role", e.target.value as "adult" | "child")
                      }
                    >
                      <option value="child">Child</option>
                      <option value="adult">Adult</option>
                    </Select>
                  </FormField>
                </div>
                {member.role === "child" && (
                  <FormField label="FAVOURITE CANDY">
                    <Input
                      value={member.favoriteCandy}
                      onChange={(e) => updateMember(member.id, "favoriteCandy", e.target.value)}
                      placeholder="e.g. Chocolate eggs, jelly beans…"
                    />
                  </FormField>
                )}
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addMember}>
              + ADD FAMILY MEMBER
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "SAVING…" : existing ? "UPDATE REGISTRATION" : "SUBMIT REGISTRATION"}
          </Button>
          <p className="text-[10px] text-muted tracking-wide">
            By submitting, you confirm that all information is accurate.
          </p>
        </div>
      </form>
    </PageShell>
  );
}
