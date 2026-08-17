import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-charcoal text-white border-transparent hover:bg-charcoal-hover",
  secondary:
    "bg-surface text-ink border-line-strong hover:border-ink-tertiary hover:bg-canvas-soft",
  accent:
    "bg-gold text-ink border-transparent hover:bg-gold-2",
  ghost:
    "bg-transparent text-ink-secondary border-transparent hover:bg-canvas-soft hover:text-ink",
  dark:
    "bg-surface text-charcoal border-transparent hover:bg-gold-soft",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[12px]",
  md: "px-[22px] py-3 text-[13px]",
  lg: "px-7 py-3.5 text-[14px]",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-all duration-[180ms] ease-out disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
