"use client";

import { LanguageProvider } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  return <LanguageProvider initialLocale={initialLocale}>{children}</LanguageProvider>;
}
