import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <span
          className={cn(
            "mb-4 inline-flex items-center rounded-full border px-3 py-1 text-[11px]",
            dark
              ? "border-white/10 bg-white/5 text-white/70"
              : "border-line bg-gold-soft text-gold-2",
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "max-w-[700px] text-[32px] font-bold leading-[0.98] tracking-[-0.04em] md:text-[40px]",
          align === "center" && "mx-auto",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-[600px] text-[15px] leading-[1.6]",
            align === "center" && "mx-auto",
            dark ? "text-white/60" : "text-ink-secondary",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
