import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  dark = false,
}: {
  label: string;
  value: string;
  hint?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[16px] border p-6",
        dark
          ? "border-white/10 bg-white/[0.03]"
          : "border-line-muted bg-surface shadow-k",
      )}
    >
      {!dark ? (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] bg-gold"
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] bg-gold/70"
        />
      )}
      <div
        className={cn(
          "text-[11px] uppercase tracking-[0.08em]",
          dark ? "text-white/55" : "text-ink-secondary",
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "mt-3 text-[34px] font-bold leading-none tracking-[-0.04em] md:text-[38px]",
          dark ? "text-white" : "text-ink",
        )}
      >
        {value}
      </div>
      {hint ? (
        <p
          className={cn(
            "mt-2 text-[12px]",
            dark ? "text-white/45" : "text-ink-tertiary",
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
