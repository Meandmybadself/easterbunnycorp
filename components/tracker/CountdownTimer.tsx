"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  label: string;
}

function pad(n: number) {
  return String(Math.floor(n)).padStart(2, "0");
}

export default function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, targetDate.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const totalSeconds = diff / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-bold tracking-[0.25em] text-muted">{label}</div>
      <div className="flex items-baseline gap-1 font-bold">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl tabular-nums">{pad(hours)}</div>
          <div className="text-[9px] tracking-[0.2em] text-muted mt-1">HRS</div>
        </div>
        <div className="text-3xl sm:text-4xl pb-4">:</div>
        <div className="text-center">
          <div className="text-4xl sm:text-5xl tabular-nums">{pad(minutes)}</div>
          <div className="text-[9px] tracking-[0.2em] text-muted mt-1">MIN</div>
        </div>
        <div className="text-3xl sm:text-4xl pb-4">:</div>
        <div className="text-center">
          <div className="text-4xl sm:text-5xl tabular-nums">{pad(seconds)}</div>
          <div className="text-[9px] tracking-[0.2em] text-muted mt-1">SEC</div>
        </div>
      </div>
    </div>
  );
}
