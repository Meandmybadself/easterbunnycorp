"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeState } from "@/lib/share";
import { saveFamily, saveMessages } from "@/lib/storage";

type Phase = "loading" | "confirm" | "error" | "done";

export default function RestorePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [familyName, setFamilyName] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [encoded, setEncoded] = useState("");

  useEffect(() => {
    const hash = window.location.hash.slice(1); // strip leading #
    if (!hash) { setPhase("error"); return; }

    const state = decodeState(hash);
    if (!state || state.v !== 1) { setPhase("error"); return; }

    setEncoded(hash);
    setFamilyName(state.family?.primaryName ?? "Unknown");
    setMessageCount(state.messages?.length ?? 0);
    setPhase("confirm");
  }, []);

  const handleRestore = () => {
    const state = decodeState(encoded);
    if (!state) return;
    if (state.family) saveFamily(state.family as Parameters<typeof saveFamily>[0]);
    if (state.messages) saveMessages(state.messages);
    setPhase("done");
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-3xl mb-3" aria-hidden>🐰</div>
          <div className="text-[10px] font-bold tracking-[0.3em] text-muted mb-1">
            EASTER BUNNY CORPORATION
          </div>
          <h1 className="text-xl font-bold">RESTORE FAMILY FILE</h1>
        </div>

        {phase === "loading" && (
          <div className="border border-border p-6 text-center text-[12px] text-muted tracking-wide">
            DECODING STATE…
          </div>
        )}

        {phase === "confirm" && (
          <div className="border border-border p-6 space-y-5">
            <div className="text-[10px] font-bold tracking-[0.2em] text-muted">
              SHARED FILE DETECTED
            </div>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted">Family</span>
                <span className="font-bold">{familyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Messages</span>
                <span className="font-bold">{messageCount}</span>
              </div>
            </div>
            <div className="border border-border bg-yellow-light p-3 text-[11px] leading-relaxed">
              <strong>Note:</strong> This will overwrite any existing family data on this device.
              Family photos are not included in shared links.
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRestore}
                className="flex-1 bg-ink text-cream font-bold text-[11px] tracking-[0.15em] py-3 border border-ink hover:bg-ink/80 transition-colors"
              >
                RESTORE TO THIS DEVICE
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-4 border border-border font-bold text-[11px] tracking-[0.12em] hover:bg-cream-dark transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="border-l-4 border-alert p-5 bg-pink-light space-y-2">
            <div className="text-[10px] font-bold tracking-[0.2em] text-muted">INVALID LINK</div>
            <p className="text-[13px]">This share link is missing or malformed. Please request a new one.</p>
            <button
              onClick={() => router.push("/")}
              className="mt-2 text-[11px] font-bold tracking-wide underline underline-offset-2"
            >
              GO TO HOME PAGE
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="border-l-4 border-mint p-5 bg-mint-light space-y-1">
            <div className="text-[10px] font-bold tracking-[0.2em] text-muted">SUCCESS</div>
            <p className="text-[13px] font-bold">File restored. Redirecting to dashboard…</p>
          </div>
        )}
      </div>
    </div>
  );
}
