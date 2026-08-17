import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  hover = false,
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-line-muted bg-surface p-6 shadow-k",
        hover &&
          "transition-all duration-200 ease-out hover:border-line-strong hover:shadow-[0_6px_24px_rgba(17,19,18,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
