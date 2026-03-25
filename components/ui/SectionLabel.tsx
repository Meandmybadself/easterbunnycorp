interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="text-[10px] font-bold tracking-[0.25em] text-muted whitespace-nowrap">
        {children}
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: "pink" | "lavender" | "mint" | "yellow" | "sage";
}

const accentColors = {
  pink: "bg-pink-light border-l-4 border-pink",
  lavender: "bg-lavender-light border-l-4 border-lavender",
  mint: "bg-mint-light border-l-4 border-mint",
  yellow: "bg-yellow-light border-l-4 border-yellow",
  sage: "bg-sage-light border-l-4 border-sage",
};

export function PageHeader({ eyebrow, title, subtitle, accent = "sage" }: PageHeaderProps) {
  return (
    <div className={`px-6 py-8 ${accentColors[accent]}`}>
      {eyebrow && (
        <div className="text-[10px] font-bold tracking-[0.25em] text-muted mb-2">
          {eyebrow}
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm text-muted max-w-xl">{subtitle}</p>
      )}
    </div>
  );
}
