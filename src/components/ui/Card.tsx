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
        "rounded-[18px] border border-[#E5E5E5] bg-white p-6 shadow-[0_4px_30px_rgba(0,0,0,0.025)]",
        hover &&
          "transition-all duration-200 ease-out hover:border-[#D5D5D5] hover:shadow-[0_10px_40px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
