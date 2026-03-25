"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/tracker", label: "BUNNY TRACKER" },
  { href: "/contact", label: "CONTACT" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-ink bg-cream">
      {/* Top bar */}
      <div className="bg-ink text-cream text-[10px] font-bold tracking-[0.2em] px-4 py-1 text-center">
        OFFICIAL EASTER BUNNY CORPORATION — ESTABLISHED 4 B.C. — ALL RIGHTS RESERVED
      </div>

      {/* Main header */}
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Seal + wordmark */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-full border-2 border-ink flex items-center justify-center bg-yellow-light flex-shrink-0 group-hover:bg-yellow transition-colors">
            <span className="text-2xl" aria-hidden>🐰</span>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.25em] text-muted">FEDERAL REGISTRY</div>
            <div className="text-xl font-bold tracking-tight leading-none">EASTER BUNNY CORP.</div>
            <div className="text-[10px] tracking-[0.15em] text-muted">VISITOR ADMINISTRATION DIVISION</div>
          </div>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Registration CTA */}
        <Link
          href="/dashboard"
          className="text-[11px] font-bold tracking-[0.15em] border border-ink px-3 py-2 hover:bg-ink hover:text-cream transition-colors"
        >
          MY FAMILY FILE
        </Link>
      </div>

      {/* Nav */}
      <nav className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4">
          <ul className="flex gap-0">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block px-4 py-3 text-[11px] font-bold tracking-[0.15em] border-r border-border transition-colors
                      ${active ? "bg-ink text-cream" : "hover:bg-cream-dark"}`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
