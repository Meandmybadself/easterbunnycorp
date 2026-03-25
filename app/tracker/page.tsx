"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/tracker/CountdownTimer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  thisYearEaster,
  thisYearEasterEve,
  isEasterEve,
  isEasterDay,
  isAfterEaster,
  formatEasterDate,
} from "@/lib/easter";
import {
  getTrackerProgress,
  getTrackerPosition,
  getNearestStop,
  getStatusMessage,
  BUNNY_ROUTE,
} from "@/lib/tracker";
import type { TrackerPhase } from "@/lib/types";

const BunnyMap = dynamic(() => import("@/components/tracker/BunnyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 sm:h-96 border border-border bg-cream-dark flex items-center justify-center text-[11px] text-muted tracking-wide">
      LOADING MAP…
    </div>
  ),
});

function getPhase(now: Date): TrackerPhase {
  if (isAfterEaster(now)) return "offline_after";
  if (isEasterDay(now)) return "live";
  if (isEasterEve(now)) return "eve_countdown";
  return "offline_before";
}

export default function TrackerPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [progress, setProgress] = useState(0);

  const tick = useCallback(() => {
    const n = new Date();
    setNow(n);
    if (isEasterDay(n)) {
      setProgress(getTrackerProgress(n));
    }
  }, []);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 10000); // update every 10s
    return () => clearInterval(id);
  }, [tick]);

  if (!now) return null;

  const phase = getPhase(now);
  const easter = thisYearEaster();
  const easterEve = thisYearEasterEve();
  const formattedEaster = formatEasterDate(easter);

  // Easter morning start time (midnight local)
  const easterMorning = new Date(
    easter.getUTCFullYear(),
    easter.getUTCMonth(),
    easter.getUTCDate(),
    0, 0, 0
  );

  return (
    <PageShell>
      {/* Header bar */}
      <div className="border-b-2 border-ink bg-ink text-cream">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <div className="text-[10px] font-bold tracking-[0.25em] text-cream/60 mb-1">
              OFFICIAL EASTER BUNNY TRACKING SYSTEM — {easter.getUTCFullYear()}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">BUNNY TRACKER</h1>
          </div>
          <div className="sm:ml-auto flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${phase === "live" ? "bg-mint animate-pulse" : "bg-muted"}`} />
            <span className="text-[11px] font-bold tracking-[0.15em]">
              {phase === "live" ? "LIVE" : "OFFLINE"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── OFFLINE BEFORE ── */}
        {phase === "offline_before" && (
          <div className="space-y-8">
            <div className="border-l-4 border-yellow p-6 bg-yellow-light">
              <div className="text-[10px] font-bold tracking-[0.25em] text-muted mb-3">
                SYSTEM STATUS
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl" aria-hidden>🌙</span>
                <div>
                  <h2 className="text-xl font-bold mb-1">TRACKER OFFLINE</h2>
                  <p className="text-[12px] text-muted leading-relaxed max-w-lg">
                    The Easter Bunny Tracking System activates on Easter Eve. Operations
                    are currently in the preparation phase. All systems will be online on{" "}
                    <strong>{formattedEaster}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border p-6 bg-cream-dark">
              <CountdownTimer
                targetDate={easterMorning}
                label="TIME UNTIL OPERATIONS BEGIN"
              />
            </div>

            <RoutePreviewer />
          </div>
        )}

        {/* ── EASTER EVE ── */}
        {phase === "eve_countdown" && (
          <div className="space-y-8">
            <div className="border-l-4 border-lavender p-6 bg-lavender-light">
              <div className="text-[10px] font-bold tracking-[0.25em] text-muted mb-3">
                SYSTEM STATUS
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl" aria-hidden>🥕</span>
                <div>
                  <h2 className="text-xl font-bold mb-1">FINAL PREPARATIONS UNDERWAY</h2>
                  <p className="text-[12px] text-muted leading-relaxed max-w-lg">
                    Easter Eve. The Easter Bunny is in final preparations at Headquarters.
                    Departure is scheduled for midnight. Live tracking commences at{" "}
                    <strong>00:00 on {formattedEaster}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border p-6 bg-cream-dark">
              <CountdownTimer
                targetDate={easterMorning}
                label="TIME UNTIL DEPARTURE"
              />
            </div>

            <RoutePreviewer />
          </div>
        )}

        {/* ── LIVE ── */}
        {phase === "live" && (
          <div className="space-y-6">
            {/* Status bar */}
            <div className="border-l-4 border-mint p-4 bg-mint-light flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-mint animate-pulse" />
                <span className="text-[11px] font-bold tracking-[0.2em]">LIVE TRACKING ACTIVE</span>
              </div>
              <div className="flex-1" />
              <span className="text-[11px] tracking-wide text-muted">
                UPDATED EVERY 10 SECONDS
              </span>
            </div>

            {/* Current status */}
            <div className="border border-border p-5 bg-cream space-y-1">
              <div className="text-[10px] font-bold tracking-[0.2em] text-muted">CURRENT STATUS</div>
              <div className="text-lg font-bold">{getStatusMessage(progress)}</div>
              <div className="text-[12px] text-muted">
                Near: <strong>{getNearestStop(progress).name}</strong>
              </div>
            </div>

            {/* Map */}
            <BunnyMap progress={progress} />

            {/* Progress + countdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-border bg-border">
              <div className="bg-cream p-5">
                <div className="text-[10px] font-bold tracking-[0.2em] text-muted mb-3">ROUTE PROGRESS</div>
                <div className="w-full bg-border h-2 mb-2">
                  <div
                    className="h-2 bg-ink transition-all duration-1000"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <div className="text-2xl font-bold">{Math.round(progress * 100)}%</div>
                <div className="text-[11px] text-muted mt-1">of global route complete</div>
              </div>
              <div className="bg-cream-dark p-5">
                <CountdownTimer
                  targetDate={new Date(
                    easter.getUTCFullYear(),
                    easter.getUTCMonth(),
                    easter.getUTCDate(),
                    23, 59, 0
                  )}
                  label="ESTIMATED OPERATIONS END"
                />
              </div>
            </div>

            {/* Route stops */}
            <StopsList progress={progress} />
          </div>
        )}

        {/* ── AFTER EASTER ── */}
        {phase === "offline_after" && (
          <div className="space-y-8">
            <div className="border-l-4 border-sage p-6 bg-sage-light">
              <div className="text-[10px] font-bold tracking-[0.25em] text-muted mb-3">
                SYSTEM STATUS
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl" aria-hidden>🎉</span>
                <div>
                  <h2 className="text-xl font-bold mb-1">OPERATIONS COMPLETE</h2>
                  <p className="text-[12px] text-muted leading-relaxed max-w-lg">
                    The {easter.getUTCFullYear()} Easter delivery mission has concluded
                    successfully. The Easter Bunny has returned to Headquarters. The
                    tracker will be reactivated for {easter.getUTCFullYear() + 1}.
                  </p>
                </div>
              </div>
            </div>
            <div className="border border-border p-6 bg-cream-dark">
              <div className="text-[10px] font-bold tracking-[0.2em] text-muted mb-2">MISSION SUMMARY</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                {[
                  { label: "STOPS", value: String(BUNNY_ROUTE.length - 2) },
                  { label: "REGIONS", value: "7" },
                  { label: "STATUS", value: "SUCCESS" },
                  { label: "NEXT MISSION", value: String(easter.getUTCFullYear() + 1) },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-border p-3 text-center bg-cream">
                    <div className="text-xl font-bold">{value}</div>
                    <div className="text-[10px] tracking-[0.15em] text-muted mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function RoutePreviewer() {
  return (
    <div className="space-y-3">
      <SectionLabel>PLANNED {new Date().getFullYear()} ROUTE</SectionLabel>
      <div className="border border-border overflow-hidden">
        {BUNNY_ROUTE.filter((_, i) => i % 3 === 0 || i === BUNNY_ROUTE.length - 1).map((stop, i) => (
          <div key={i} className={`flex items-center gap-4 px-4 py-3 text-[12px] border-b border-border last:border-b-0 ${i % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}>
            <span className="text-muted font-bold w-6 text-right flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-bold">{stop.name}</span>
            <span className="ml-auto text-muted tabular-nums">{stop.localTime}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StopsList({ progress }: { progress: number }) {
  const totalStops = BUNNY_ROUTE.length - 1;
  const currentIdx = Math.floor(progress * totalStops);

  return (
    <div className="space-y-3">
      <SectionLabel>ROUTE WAYPOINTS</SectionLabel>
      <div className="border border-border overflow-hidden max-h-64 overflow-y-auto">
        {BUNNY_ROUTE.map((stop, i) => {
          const visited = i < currentIdx;
          const current = i === currentIdx;
          return (
            <div
              key={i}
              className={`flex items-center gap-4 px-4 py-2.5 text-[12px] border-b border-border last:border-b-0
                ${current ? "bg-mint-light font-bold" : visited ? "bg-cream-dark opacity-60" : "bg-cream"}`}
            >
              <span className="text-[11px] w-4 flex-shrink-0">
                {visited ? "✓" : current ? "🐰" : "·"}
              </span>
              <span className={current ? "font-bold" : ""}>{stop.name}</span>
              <span className="ml-auto text-muted tabular-nums">{stop.localTime}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
