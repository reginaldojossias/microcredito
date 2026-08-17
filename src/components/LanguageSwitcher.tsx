"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { locales, type Locale } from "@/lib/i18n/types";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, pending, dict } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-canvas-soft p-0.5",
        className,
      )}
      role="group"
      aria-label={dict.language.label}
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          disabled={pending}
          onClick={() => setLocale(code as Locale)}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
            locale === code
              ? "bg-charcoal text-white"
              : "text-ink-secondary hover:text-ink",
          )}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
