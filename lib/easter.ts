/**
 * Computes Easter Sunday for a given year using the Gaussian algorithm.
 * Returns a Date at midnight UTC.
 */
export function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 1-based
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

/** Returns Easter for the current calendar year. */
export function thisYearEaster(): Date {
  return getEasterDate(new Date().getFullYear());
}

/** Returns Easter Eve (Holy Saturday) for the current year. */
export function thisYearEasterEve(): Date {
  const easter = thisYearEaster();
  const eve = new Date(easter);
  eve.setUTCDate(eve.getUTCDate() - 1);
  return eve;
}

/** Strips time from a Date, returning midnight local time. */
export function toLocalMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Is today Easter Eve? */
export function isEasterEve(now: Date = new Date()): boolean {
  const eve = thisYearEasterEve();
  return (
    now.getFullYear() === eve.getUTCFullYear() &&
    now.getMonth() === eve.getUTCMonth() &&
    now.getDate() === eve.getUTCDate()
  );
}

/** Is today Easter Sunday? */
export function isEasterDay(now: Date = new Date()): boolean {
  const easter = thisYearEaster();
  return (
    now.getFullYear() === easter.getUTCFullYear() &&
    now.getMonth() === easter.getUTCMonth() &&
    now.getDate() === easter.getUTCDate()
  );
}

/** Is today after Easter? */
export function isAfterEaster(now: Date = new Date()): boolean {
  const easter = thisYearEaster();
  const localEaster = new Date(
    easter.getUTCFullYear(),
    easter.getUTCMonth(),
    easter.getUTCDate() + 1
  );
  return now >= localEaster;
}

/** Format a Date as "DD MONTH YYYY" (e.g. "05 APRIL 2026") */
export function formatEasterDate(date: Date): string {
  const months = [
    "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
    "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER",
  ];
  return `${String(date.getUTCDate()).padStart(2, "0")} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
