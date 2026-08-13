export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("AOA", "Kz");
}

export function formatDate(value: string): string {
  if (!value || value === "—") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
