import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "@/lib/locale-config";
import { getDictionary } from "./index";
import { defaultLocale, locales, type Locale } from "./types";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}

export async function getServerI18n() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return {
    locale,
    dict,
    formatCurrency: (value: number) => formatCurrency(value, locale),
    formatDate: (value: string) => formatDate(value, locale),
    formatDateTime: (value: string) => formatDateTime(value, locale),
  };
}
