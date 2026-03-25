"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/FormField";
import { getBunnyAuth, setBunnyAuth, getBunnyPin } from "@/lib/storage";

export default function AdministrationLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Already authenticated — redirect
    const auth = getBunnyAuth();
    if (auth.isAuthenticated) {
      router.replace("/administration/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    const correctPin = getBunnyPin();
    if (pin === correctPin) {
      setBunnyAuth(true);
      router.push("/administration/dashboard");
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setPin("");
      if (next >= 5) {
        setLocked(true);
        setError("ACCOUNT LOCKED. Too many incorrect attempts. Please refresh to try again.");
      } else {
        setError(`INCORRECT PIN. ${5 - next} attempt${5 - next === 1 ? "" : "s"} remaining.`);
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Seal */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-cream/20 bg-cream/5 mb-4">
            <span className="text-3xl" aria-hidden>🐰</span>
          </div>
          <div className="text-[10px] font-bold tracking-[0.3em] text-cream/50 mb-1">
            EASTER BUNNY CORPORATION
          </div>
          <h1 className="text-xl font-bold text-cream tracking-tight">
            ADMINISTRATION PORTAL
          </h1>
          <div className="text-[10px] tracking-[0.2em] text-cream/40 mt-1">
            RESTRICTED ACCESS — AUTHORISED PERSONNEL ONLY
          </div>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="border border-cream/10 bg-cream/5 p-6 space-y-5"
        >
          <FormField label="ACCESS PIN" error={error}>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              disabled={locked}
              placeholder="••••"
              className="w-full border border-cream/20 bg-cream/5 text-cream px-3 py-2.5 text-[14px] tracking-[0.3em] text-center focus:outline-none focus:border-cream/50 disabled:opacity-40"
              autoFocus
            />
          </FormField>

          <Button
            type="submit"
            size="lg"
            disabled={locked || pin.length < 1}
            className="w-full bg-cream text-ink border-cream hover:bg-cream/80"
          >
            AUTHENTICATE
          </Button>
        </form>

        <div className="text-center text-[10px] text-cream/30 tracking-wide">
          DEFAULT PIN: 9274 — CHANGE VIA ADMINISTRATION DASHBOARD
        </div>
      </div>
    </div>
  );
}
