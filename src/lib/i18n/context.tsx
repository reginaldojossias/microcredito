"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getDictionary, translateStatus, type Dictionary } from "./index";
import { setLocaleAction } from "./actions";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { defaultLocale, type Locale } from "./types";

type I18nContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
  pending: boolean;
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  formatDateTime: (value: string) => string;
  statusLabel: (status: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const locale = initialLocale;
  const dict = useMemo(() => getDictionary(locale), [locale]);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) return;
      startTransition(async () => {
        await setLocaleAction(nextLocale);
        router.refresh();
      });
    },
    [locale, router],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dict,
      setLocale,
      pending,
      formatCurrency: (v) => formatCurrency(v, locale),
      formatDate: (v) => formatDate(v, locale),
      formatDateTime: (v) => formatDateTime(v, locale),
      statusLabel: (status) => translateStatus(locale, status),
    }),
    [dict, locale, pending, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
}
