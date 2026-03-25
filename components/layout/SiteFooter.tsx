export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t-2 border-ink bg-ink text-cream">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em]">EASTER BUNNY CORPORATION</div>
          <div className="text-[10px] tracking-[0.1em] text-cream/60 mt-0.5">
            VISITOR ADMINISTRATION DIVISION — SINCE 4 B.C.
          </div>
        </div>
        <div className="text-[10px] tracking-[0.1em] text-cream/60 text-right">
          <div>ALL DATA STORED LOCALLY ON THIS DEVICE.</div>
          <div>NO INFORMATION IS TRANSMITTED TO EXTERNAL SERVERS.</div>
          <div className="mt-1">© {year} EASTER BUNNY CORP. ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </footer>
  );
}
