import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";
import { thisYearEaster, formatEasterDate } from "@/lib/easter";

export default function HomePage() {
  const easterDate = thisYearEaster();
  const formattedDate = formatEasterDate(easterDate);

  return (
    <PageShell>
      {/* Hero */}
      <section
        className="border-b-2 border-ink bg-yellow-light relative"
        style={{
          backgroundImage: "url('/bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "75% 50%",
        }}
      >
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="text-[10px] font-bold tracking-[0.3em] text-white/70 mb-4">
              OFFICIAL NOTICE — VISITOR REGISTRATION OPEN
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white">
              Register Your Family for the{" "}
              <span className="text-white">{easterDate.getUTCFullYear()}</span>{" "}
              Easter Visit.
            </h1>
            <p className="text-sm text-white/75 mb-8 max-w-lg leading-relaxed">
              Families must be pre-registered to receive an official visit from the
              Easter Bunny. All registration information is kept strictly confidential
              and stored only on this device.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg">REGISTER YOUR FAMILY</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">VIEW MY FILE</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visit date banner */}
      <section className="border-b border-border bg-cream-dark">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-muted">
            {easterDate.getUTCFullYear()} VISIT DATE
          </span>
          <div className="h-4 w-px bg-border hidden sm:block sm:mx-4" />
          <span className="text-sm font-bold">{formattedDate}</span>
          <div className="flex-1" />
          <Link href="/tracker" className="text-[10px] font-bold tracking-[0.15em] underline underline-offset-2">
            BUNNY TRACKER →
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-border bg-border">
          <div className="bg-cream p-6">
            <div className="text-3xl mb-4" aria-hidden>🥚</div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-muted mb-2">STEP 01</div>
            <h2 className="font-bold text-base mb-2">Register Your Family</h2>
            <p className="text-[12px] text-muted leading-relaxed">
              Provide your address, family members, and ages. Registration is
              required for all households seeking an official visit.
            </p>
          </div>
          <div className="bg-pink-light p-6">
            <div className="text-3xl mb-4" aria-hidden>📋</div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-muted mb-2">STEP 02</div>
            <h2 className="font-bold text-base mb-2">Await Confirmation</h2>
            <p className="text-[12px] text-muted leading-relaxed">
              Your registration will be reviewed. Visit scheduling and status
              updates will appear in your family dashboard.
            </p>
          </div>
          <div className="bg-lavender-light p-6">
            <div className="text-3xl mb-4" aria-hidden>🐰</div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-muted mb-2">STEP 03</div>
            <h2 className="font-bold text-base mb-2">Track the Visit</h2>
            <p className="text-[12px] text-muted leading-relaxed">
              On Easter morning, monitor the live Bunny Tracker to follow
              the official route and estimate arrival at your location.
            </p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="border border-border p-6 bg-mint-light">
          <div className="flex gap-4 items-start">
            <div className="text-2xl flex-shrink-0" aria-hidden>📌</div>
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-muted mb-1">
                IMPORTANT NOTICE
              </div>
              <p className="text-[12px] leading-relaxed text-ink">
                All data collected during registration is stored exclusively on this
                device using browser local storage. No personal information is
                transmitted to, or stored on, any external server. For complaints
                or missed appearances, please use the{" "}
                <Link href="/contact" className="font-bold underline underline-offset-2">
                  Contact Form
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
