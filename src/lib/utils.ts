import { APP_CURRENCY, APP_TIMEZONE, localeToIntl } from "@/lib/locale-config";
import type { Locale } from "@/lib/i18n/types";

export function formatCurrency(value: number, locale: Locale = "pt"): string {
  const formatted = new Intl.NumberFormat(localeToIntl[locale], {
    style: "currency",
    currency: APP_CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);

  if (locale === "pt") {
    return formatted.replace(/\s?MTn?\.?/i, " MT").replace(/\s?MZN/i, " MT");
  }

  return formatted;
}

export function formatDate(value: string, locale: Locale = "pt"): string {
  if (!value || value === "—") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(localeToIntl[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: APP_TIMEZONE,
  }).format(date);
}

export function formatDateTime(value: string, locale: Locale = "pt"): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(localeToIntl[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: APP_TIMEZONE,
  }).format(date);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function simulateLoan(amount: number, term: number, monthlyRate: number) {
  const rate = monthlyRate / 100;
  const payment =
    rate === 0
      ? amount / term
      : (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
  const total = payment * term;
  return {
    monthlyPayment: Math.round(payment),
    totalPayable: Math.round(total),
    totalInterest: Math.round(total - amount),
  };
}

export function isProfileVerified(
  profile: { verification_status?: string | null } | null | undefined,
): boolean {
  return profile?.verification_status === "verificado";
}
