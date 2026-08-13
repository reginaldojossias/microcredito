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
        "rounded-[18px] border p-6 text-center",
        dark
          ? "border-white/10 bg-white/[0.03]"
          : "border-[#E5E5E5] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.025)]",
      )}
    >
      <div
        className={cn(
          "text-[42px] font-bold leading-none tracking-[-0.04em]",
          dark ? "text-white" : "text-[#0A0A0A]",
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "mt-3 text-[11px] uppercase tracking-[0.08em]",
          dark ? "text-[#AAAAAA]" : "text-[#666666]",
        )}
      >
        {label}
      </div>
      {hint ? (
        <p className={cn("mt-2 text-[12px]", dark ? "text-[#AFAFAF]" : "text-[#999999]")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
