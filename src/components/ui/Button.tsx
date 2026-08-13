import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white border-transparent hover:-translate-y-px hover:bg-[#111]",
  secondary:
    "bg-white text-[#111] border-[#DDDDDD] hover:-translate-y-px hover:border-[#C8C8C8]",
  ghost: "bg-transparent text-[#555] border-transparent hover:bg-[#FAFAFA]",
  dark: "bg-white text-black border-transparent hover:-translate-y-px",
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
        "inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-all duration-[180ms] ease-out disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
